export type {
  PronunciationAudio,
  PronunciationEntry,
  PronunciationMode,
  PronunciationSyllable as Syllable,
} from '@smarttalky/types'

import type {
  PronunciationAudio,
  PronunciationEntry,
  PronunciationMode,
} from '@smarttalky/types'

export interface PronunciationResult {
  entry: PronunciationEntry
  audio: readonly PronunciationAudio[]
}

export type PlaybackSource = 'provider' | 'web-speech'

export interface PlaybackResult {
  source: PlaybackSource
  usedFallback: boolean
}

export type LookupPronunciation = (
  text: string,
  signal?: AbortSignal,
) => Promise<PronunciationResult>
export type PlayPronunciation = (mode: PronunciationMode) => Promise<PlaybackResult>
