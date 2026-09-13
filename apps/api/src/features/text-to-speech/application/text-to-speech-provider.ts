import type { PronunciationAudio, PronunciationMode } from '@smarttalky/types'

export interface TextToSpeechRequest {
  text: string
  locale: 'en-US'
  mode: PronunciationMode
}

/** Metadatos técnicos suficientes para validar y persistir el resultado. */
export interface TextToSpeechMetadata {
  mimeType: PronunciationAudio['mimeType']
  provider: string
  model: string
  voice: string
  durationMs?: number | undefined
}

export interface TextToSpeechResult {
  bytes: Uint8Array
  metadata: TextToSpeechMetadata
}

/** Puerto neutral: ningún caso de uso necesita importar el SDK de un proveedor. */
export interface TextToSpeechProvider {
  synthesize(
    request: TextToSpeechRequest,
    signal?: AbortSignal,
  ): Promise<TextToSpeechResult>
}

export const TEXT_TO_SPEECH_ERROR_CODES = [
  'NOT_CONFIGURED',
  'REQUEST_ABORTED',
  'REQUEST_FAILED',
  'INVALID_RESPONSE',
] as const

export type TextToSpeechErrorCode = (typeof TEXT_TO_SPEECH_ERROR_CODES)[number]

/** Error técnico tipado; el adaptador HTTP decidirá qué mensaje público mostrar. */
export class TextToSpeechProviderError extends Error {
  public readonly code: TextToSpeechErrorCode
  public readonly retryable: boolean

  public constructor(
    code: TextToSpeechErrorCode,
    message: string,
    options: { retryable: boolean; cause?: unknown },
  ) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause })
    this.name = 'TextToSpeechProviderError'
    this.code = code
    this.retryable = options.retryable
  }
}
