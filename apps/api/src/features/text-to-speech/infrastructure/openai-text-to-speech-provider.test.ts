import { describe, expect, it, vi } from 'vitest'

import { MAX_AUDIO_BYTE_LENGTH } from '../../audio/application/get-audio.js'
import { getSpeechModeProfile } from '../application/speech-mode-profile.js'
import type { TextToSpeechRequest } from '../application/text-to-speech-provider.js'
import {
  createOpenAiTextToSpeechProvider,
  DEFAULT_OPENAI_TTS_MODEL,
  DEFAULT_OPENAI_TTS_VOICE,
  type OpenAiSdkClient,
} from './openai-text-to-speech-provider.js'

const request: TextToSpeechRequest = {
  text: 'comfortable',
  locale: 'en-US',
  mode: 'natural',
}

function clientReturning(bytes: Uint8Array): {
  client: OpenAiSdkClient
  create: ReturnType<typeof vi.fn<OpenAiSdkClient['audio']['speech']['create']>>
} {
  const create = vi.fn<OpenAiSdkClient['audio']['speech']['create']>().mockResolvedValue({
    async arrayBuffer() {
      return bytes.buffer as ArrayBuffer
    },
  })

  return { client: { audio: { speech: { create } } }, create }
}

describe('createOpenAiTextToSpeechProvider', () => {
  it('mantiene la ausencia de clave como un estado soportado', async () => {
    const provider = createOpenAiTextToSpeechProvider({ apiKey: '   ' })

    await expect(provider.synthesize(request)).rejects.toMatchObject({
      code: 'NOT_CONFIGURED',
      retryable: false,
    })
  })

  it('envía el contrato esperado al SDK y devuelve bytes WAV seguros', async () => {
    const audio = Uint8Array.from([82, 73, 70, 70])
    const { client, create } = clientReturning(audio)
    const controller = new AbortController()
    const provider = createOpenAiTextToSpeechProvider({ client })

    await expect(provider.synthesize(request, controller.signal)).resolves.toEqual({
      bytes: audio,
      metadata: {
        mimeType: 'audio/wav',
        provider: 'openai',
        model: DEFAULT_OPENAI_TTS_MODEL,
        voice: DEFAULT_OPENAI_TTS_VOICE,
      },
    })
    expect(create).toHaveBeenCalledWith(
      {
        input: 'comfortable',
        instructions: getSpeechModeProfile('natural').instructions,
        model: DEFAULT_OPENAI_TTS_MODEL,
        speed: 1,
        voice: DEFAULT_OPENAI_TTS_VOICE,
        response_format: 'wav',
      },
      { signal: controller.signal },
    )
  })

  it.each(['natural', 'slow', 'teacher'] as const)(
    'envía al SDK el perfil versionado de la modalidad %s',
    async (mode) => {
      const { client, create } = clientReturning(Uint8Array.from([1]))
      const provider = createOpenAiTextToSpeechProvider({ client })

      await provider.synthesize({ ...request, mode })

      const profile = getSpeechModeProfile(mode)
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          instructions: profile.instructions,
          speed: profile.speed,
        }),
        undefined,
      )
    },
  )

  it('permite fijar modelo y voz sin exponerlos al contrato web', async () => {
    const { client, create } = clientReturning(Uint8Array.from([1]))
    const provider = createOpenAiTextToSpeechProvider({
      client,
      model: 'tts-1',
      voice: 'alloy',
    })

    const result = await provider.synthesize(request)

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'tts-1', voice: 'alloy' }),
      undefined,
    )
    expect(result.metadata).toMatchObject({ model: 'tts-1', voice: 'alloy' })
  })

  it.each([new Uint8Array(), new Uint8Array(MAX_AUDIO_BYTE_LENGTH + 1)])(
    'rechaza respuestas vacías o demasiado grandes',
    async (audio) => {
      const { client } = clientReturning(audio)

      await expect(
        createOpenAiTextToSpeechProvider({ client }).synthesize(request),
      ).rejects.toMatchObject({ code: 'INVALID_RESPONSE', retryable: false })
    },
  )

  it('convierte fallos privados del SDK en un error tipado sin filtrarlos', async () => {
    const privateDetail = 'Authorization sk-no-debe-aparecer'
    const create = vi
      .fn<OpenAiSdkClient['audio']['speech']['create']>()
      .mockRejectedValue(new Error(privateDetail))
    const client: OpenAiSdkClient = { audio: { speech: { create } } }

    const error = await createOpenAiTextToSpeechProvider({ client })
      .synthesize(request)
      .catch((reason: unknown) => reason)

    expect(error).toMatchObject({ code: 'REQUEST_FAILED', retryable: false })
    expect(String(error)).not.toContain(privateDetail)
    expect(error).not.toHaveProperty('cause')
  })

  it('clasifica la cancelación sin reintentarla', async () => {
    const abortError = new Error('abortado por el cliente')
    abortError.name = 'AbortError'
    const create = vi
      .fn<OpenAiSdkClient['audio']['speech']['create']>()
      .mockRejectedValue(abortError)
    const client: OpenAiSdkClient = { audio: { speech: { create } } }

    await expect(
      createOpenAiTextToSpeechProvider({ client }).synthesize(request),
    ).rejects.toMatchObject({ code: 'REQUEST_ABORTED', retryable: false })
  })

  it.each([408, 409, 429, 500, 503])(
    'marca el estado recuperable %s sin exponer su detalle',
    async (status) => {
      const create = vi
        .fn<OpenAiSdkClient['audio']['speech']['create']>()
        .mockRejectedValue({ status, message: 'detalle privado' })
      const client: OpenAiSdkClient = { audio: { speech: { create } } }

      await expect(
        createOpenAiTextToSpeechProvider({ client }).synthesize(request),
      ).rejects.toMatchObject({ code: 'REQUEST_FAILED', retryable: true })
    },
  )
})
