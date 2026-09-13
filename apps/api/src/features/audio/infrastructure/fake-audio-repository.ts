import type { PronunciationMode } from '@smarttalky/types'

import type { AudioRepository } from '../application/get-audio.js'
import { FAKE_WAV_BYTES } from './fake-wav.js'

export { FAKE_WAV_BYTES } from './fake-wav.js'

export const fakeAudioKeyByMode: Readonly<Record<PronunciationMode, string>> = {
  natural: 'mock-natural',
  slow: 'mock-slow',
  teacher: 'mock-teacher',
}

const assets = new Map(
  Object.values(fakeAudioKeyByMode).map((key) => [
    key,
    { bytes: FAKE_WAV_BYTES, mimeType: 'audio/wav' as const },
  ]),
)

/** Repositorio en memoria limitado a claves conocidas; no publica directorios. */
export const fakeAudioRepository: AudioRepository = {
  async findByKey(key) {
    return assets.get(key)
  },
}
