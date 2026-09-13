import type { PronunciationEntry } from '@smarttalky/types'

export interface EducationalContentCacheEntry {
  entry: PronunciationEntry
  model: string
  promptVersion: string
  createdAt: string
}

export interface EducationalContentCache {
  findByKey(key: string): Promise<EducationalContentCacheEntry | undefined>
  put(key: string, entry: EducationalContentCacheEntry): Promise<void>
}
