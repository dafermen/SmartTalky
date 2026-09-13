import { pronunciationResponseSchema } from '@smarttalky/shared'
import type { PronunciationRequest, PronunciationResponse } from '@smarttalky/types'

export interface PronunciationProvider {
  lookup(request: PronunciationRequest): Promise<PronunciationResponse>
}

export type LookupPronunciation = (
  request: PronunciationRequest,
) => Promise<PronunciationResponse>

/** Mantiene el proveedor detrás de un puerto y valida su salida antes de publicarla. */
export function createLookupPronunciation(
  provider: PronunciationProvider,
): LookupPronunciation {
  return async (request) => {
    const response = await provider.lookup(request)
    return pronunciationResponseSchema.parse(response)
  }
}
