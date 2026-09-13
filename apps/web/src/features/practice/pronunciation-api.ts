import { pronunciationResponseSchema } from '@smarttalky/shared'

import { resolveApiUrl } from '../../config/api-url'
import type { LookupPronunciation } from './types'

export class PronunciationApiError extends Error {
  public constructor(message = 'No fue posible consultar la pronunciación.') {
    super(message)
    this.name = 'PronunciationApiError'
  }
}

/** Consulta únicamente la API propia y valida su respuesta antes de mostrarla. */
export const lookupApiPronunciation: LookupPronunciation = async (text, signal) => {
  const response = await fetch(resolveApiUrl('/api/v1/pronunciations'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      text,
      locale: 'en-US',
      modes: ['natural', 'slow', 'teacher'],
    }),
    signal: signal ?? null,
  })

  if (!response.ok) {
    throw new PronunciationApiError()
  }

  const parsedResponse = pronunciationResponseSchema.safeParse(await response.json())

  if (!parsedResponse.success) {
    throw new PronunciationApiError('La API devolvió una respuesta no válida.')
  }

  return {
    entry: parsedResponse.data.pronunciation,
    audio: parsedResponse.data.audio,
  }
}
