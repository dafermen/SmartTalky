import type { PronunciationAudio } from '@smarttalky/types'

import type { AudioIdentity } from '../domain/audio-identity.js'

export const AUDIO_METADATA_SCHEMA_VERSION = 'audio-metadata-v1'

export interface AudioCacheMetadata {
  schemaVersion: typeof AUDIO_METADATA_SCHEMA_VERSION
  key: string
  identity: AudioIdentity
  mimeType: PronunciationAudio['mimeType']
  byteLength: number
  createdAt: string
  provider: string
  durationMs?: number | undefined
}

export interface AudioCacheEntry {
  bytes: Uint8Array
  metadata: AudioCacheMetadata
}

export interface AudioCacheRepository {
  findByKey(key: string): Promise<AudioCacheEntry | undefined>
  save(entry: AudioCacheEntry): Promise<void>
}
