import { describe, expect, it } from 'vitest'

import { FAKE_WAV_BYTES } from '../../audio/infrastructure/fake-wav.js'
import { createFakeTextToSpeechProvider } from '../infrastructure/fake-text-to-speech-provider.js'
import {
  TextToSpeechProviderError,
  type TextToSpeechRequest,
} from './text-to-speech-provider.js'

const request: TextToSpeechRequest = {
  text: 'comfortable',
  locale: 'en-US',
  mode: 'natural',
}

describe('TextToSpeechProvider', () => {
  it('devuelve bytes y metadatos técnicos deterministas sin usar red', async () => {
    const result = await createFakeTextToSpeechProvider().synthesize(request)

    expect(result.bytes).toEqual(FAKE_WAV_BYTES)
    expect(result.bytes).not.toBe(FAKE_WAV_BYTES)
    expect(result.metadata).toEqual({
      mimeType: 'audio/wav',
      provider: 'fake',
      model: 'fake-tts-v1',
      voice: 'fake-en-us',
      durationMs: 100,
    })
    expect(new TextDecoder().decode(result.bytes.slice(0, 4))).toBe('RIFF')
    expect(result.bytes.byteLength).toBe(844)
  })

  it.each(['natural', 'slow', 'teacher'] as const)(
    'acepta la modalidad %s detrás del mismo puerto',
    async (mode) => {
      await expect(
        createFakeTextToSpeechProvider().synthesize({ ...request, mode }),
      ).resolves.toMatchObject({ metadata: { provider: 'fake' } })
    },
  )

  it('permite simular un fallo tipado y clasificable', async () => {
    const failure = new TextToSpeechProviderError(
      'REQUEST_FAILED',
      'Fallo controlado del fake.',
      { retryable: true },
    )
    const provider = createFakeTextToSpeechProvider({ failure })

    await expect(provider.synthesize(request)).rejects.toBe(failure)
    expect(failure).toMatchObject({
      name: 'TextToSpeechProviderError',
      code: 'REQUEST_FAILED',
      retryable: true,
    })
  })

  it('rechaza una solicitud ya cancelada sin generar audio', async () => {
    const controller = new AbortController()
    controller.abort('prueba')

    await expect(
      createFakeTextToSpeechProvider().synthesize(request, controller.signal),
    ).rejects.toMatchObject({
      code: 'REQUEST_ABORTED',
      retryable: false,
      cause: 'prueba',
    })
  })
})
