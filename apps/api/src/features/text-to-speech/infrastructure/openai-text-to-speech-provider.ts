import OpenAI from 'openai'
import type { SpeechCreateParams } from 'openai/resources/audio/speech'

import { MAX_AUDIO_BYTE_LENGTH } from '../../audio/application/get-audio.js'
import {
  TextToSpeechProviderError,
  type TextToSpeechProvider,
} from '../application/text-to-speech-provider.js'
import { getSpeechModeProfile } from '../application/speech-mode-profile.js'

export const DEFAULT_OPENAI_TTS_MODEL = 'gpt-4o-mini-tts-2025-12-15'
export const DEFAULT_OPENAI_TTS_VOICE = 'marin'

interface OpenAiSpeechResponse {
  arrayBuffer(): Promise<ArrayBuffer>
}

export interface OpenAiSdkClient {
  audio: {
    speech: {
      create(
        request: SpeechCreateParams,
        options?: { signal?: AbortSignal | undefined },
      ): Promise<OpenAiSpeechResponse>
    }
  }
}

interface OpenAiTextToSpeechProviderOptions {
  apiKey?: string | undefined
  client?: OpenAiSdkClient | undefined
  model?: string | undefined
  voice?: string | undefined
}

function createSdkClient(apiKey: string): OpenAiSdkClient {
  const client = new OpenAI({ apiKey, maxRetries: 0 })

  return {
    audio: {
      speech: {
        async create(request, options) {
          return client.audio.speech.create(request, options)
        },
      },
    },
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

function isRetryableProviderError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return false
  }

  const status = error.status
  return (
    typeof status === 'number' &&
    (status === 408 || status === 409 || status === 429 || status >= 500)
  )
}

/** Adaptador del SDK oficial; no conoce HTTP, caché ni rutas de almacenamiento. */
export function createOpenAiTextToSpeechProvider(
  options: OpenAiTextToSpeechProviderOptions = {},
): TextToSpeechProvider {
  const apiKey = options.apiKey?.trim()
  const client =
    options.client ??
    (apiKey === undefined || apiKey === '' ? undefined : createSdkClient(apiKey))
  const model = options.model ?? DEFAULT_OPENAI_TTS_MODEL
  const voice = options.voice ?? DEFAULT_OPENAI_TTS_VOICE

  return {
    async synthesize(request, signal) {
      if (client === undefined) {
        throw new TextToSpeechProviderError(
          'NOT_CONFIGURED',
          'El proveedor OpenAI TTS no está configurado.',
          { retryable: false },
        )
      }

      try {
        const profile = getSpeechModeProfile(request.mode)
        const response = await client.audio.speech.create(
          {
            input: request.text,
            instructions: profile.instructions,
            model,
            speed: profile.speed,
            voice,
            response_format: 'wav',
          },
          signal === undefined ? undefined : { signal },
        )
        const bytes = new Uint8Array(await response.arrayBuffer())

        if (bytes.byteLength === 0 || bytes.byteLength > MAX_AUDIO_BYTE_LENGTH) {
          throw new TextToSpeechProviderError(
            'INVALID_RESPONSE',
            'OpenAI TTS devolvió un audio inválido.',
            { retryable: false },
          )
        }

        return {
          bytes,
          metadata: {
            mimeType: 'audio/wav',
            provider: 'openai',
            model,
            voice,
          },
        }
      } catch (error) {
        if (error instanceof TextToSpeechProviderError) {
          throw error
        }

        if (signal?.aborted === true || isAbortError(error)) {
          throw new TextToSpeechProviderError(
            'REQUEST_ABORTED',
            'La solicitud de OpenAI TTS fue cancelada.',
            { retryable: false },
          )
        }

        throw new TextToSpeechProviderError(
          'REQUEST_FAILED',
          'OpenAI TTS no pudo generar el audio.',
          { retryable: isRetryableProviderError(error) },
        )
      }
    },
  }
}
