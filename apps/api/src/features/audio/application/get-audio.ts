import type { PronunciationAudio } from '@smarttalky/types'

import { AudioNotFoundError } from '../../../domain/errors/app-error.js'

export const MAX_AUDIO_BYTE_LENGTH = 10 * 1024 * 1024

export interface AudioAsset {
  bytes: Uint8Array
  mimeType: PronunciationAudio['mimeType']
}

export interface AudioRepository {
  findByKey(key: string): Promise<AudioAsset | undefined>
}

export type GetAudio = (key: string) => Promise<AudioAsset>

/** Recupera únicamente activos completos con MIME y tamaño permitidos. */
export function createGetAudio(repository: AudioRepository): GetAudio {
  return async (key) => {
    const asset = await repository.findByKey(key)

    if (asset === undefined) {
      throw new AudioNotFoundError()
    }

    const hasSafeMimeType =
      asset.mimeType === 'audio/mpeg' || asset.mimeType === 'audio/wav'
    const hasSafeSize =
      asset.bytes.byteLength > 0 && asset.bytes.byteLength <= MAX_AUDIO_BYTE_LENGTH

    if (!hasSafeMimeType || !hasSafeSize) {
      throw new Error('El repositorio devolvió un activo de audio inválido.')
    }

    return asset
  }
}
