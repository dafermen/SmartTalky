import type { PronunciationAudio } from '@smarttalky/types'

import {
  AUDIO_METADATA_SCHEMA_VERSION,
  type AudioCacheEntry,
  type AudioCacheRepository,
} from './audio-cache-repository.js'
import { getSpeechModeProfile } from './speech-mode-profile.js'
import {
  TextToSpeechProviderError,
  type TextToSpeechProvider,
  type TextToSpeechRequest,
  type TextToSpeechResult,
} from './text-to-speech-provider.js'
import { createAudioKey, type AudioIdentity } from '../domain/audio-identity.js'
import type { TextToSpeechMetrics } from './text-to-speech-metrics.js'

export interface SpeechGenerationConfig {
  model: string
  voice: string
  provider: string
  instructionsVersion?: string | undefined
}

export interface GetOrCreateSpeechResult {
  entry: AudioCacheEntry
  cacheStatus: 'hit' | 'miss'
}

interface GetOrCreateSpeechDependencies {
  repository: AudioCacheRepository
  provider: TextToSpeechProvider
  config: SpeechGenerationConfig
  metrics?: TextToSpeechMetrics | undefined
  now?: (() => Date) | undefined
  beforeGenerate?: (() => void) | undefined
}

export type GetOrCreateSpeech = (
  request: TextToSpeechRequest,
  signal?: AbortSignal,
) => Promise<GetOrCreateSpeechResult>

function createIdentity(
  request: TextToSpeechRequest,
  config: SpeechGenerationConfig,
): AudioIdentity {
  const profile = getSpeechModeProfile(request.mode)

  return {
    text: request.text,
    locale: request.locale,
    voice: config.voice,
    mode: request.mode,
    speed: profile.speed,
    model: config.model,
    instructionsVersion: config.instructionsVersion ?? profile.instructionsVersion,
  }
}

/** Consulta la caché antes del proveedor y persiste únicamente resultados compatibles. */
export function createGetOrCreateSpeech({
  repository,
  provider,
  config,
  metrics,
  now = () => new Date(),
  beforeGenerate,
}: GetOrCreateSpeechDependencies): GetOrCreateSpeech {
  const inFlight = new Map<string, Promise<GetOrCreateSpeechResult>>()

  return async (request, signal) => {
    const identity = createIdentity(request, config)
    const key = createAudioKey(identity)
    const current = inFlight.get(key)

    if (current !== undefined) {
      return current
    }

    const operation = (async (): Promise<GetOrCreateSpeechResult> => {
      const cached = await repository.findByKey(key)

      if (cached !== undefined) {
        metrics?.increment('cacheHit')
        return { entry: cached, cacheStatus: 'hit' }
      }

      metrics?.increment('cacheMiss')
      let generated: TextToSpeechResult
      try {
        beforeGenerate?.()
        generated = await provider.synthesize(request, signal)
        metrics?.increment('generation')
      } catch (error) {
        metrics?.increment('error')
        throw error
      }

      if (
        generated.metadata.model !== config.model ||
        generated.metadata.voice !== config.voice ||
        generated.metadata.provider !== config.provider
      ) {
        throw new TextToSpeechProviderError(
          'INVALID_RESPONSE',
          'El proveedor TTS devolvió metadatos incompatibles.',
          { retryable: false },
        )
      }

      const metadata: AudioCacheEntry['metadata'] = {
        schemaVersion: AUDIO_METADATA_SCHEMA_VERSION,
        key,
        identity,
        mimeType: generated.metadata.mimeType,
        byteLength: generated.bytes.byteLength,
        createdAt: now().toISOString(),
        provider: generated.metadata.provider,
        ...(generated.metadata.durationMs === undefined
          ? {}
          : { durationMs: generated.metadata.durationMs }),
      }
      const entry = { bytes: generated.bytes, metadata }
      await repository.save(entry)

      return { entry, cacheStatus: 'miss' }
    })()

    inFlight.set(key, operation)

    try {
      return await operation
    } finally {
      if (inFlight.get(key) === operation) {
        inFlight.delete(key)
      }
    }
  }
}

export function toPronunciationAudio(entry: AudioCacheEntry): PronunciationAudio {
  return {
    key: entry.metadata.key,
    mode: entry.metadata.identity.mode,
    mimeType: entry.metadata.mimeType,
    byteLength: entry.metadata.byteLength,
    ...(entry.metadata.durationMs === undefined
      ? {}
      : { durationMs: entry.metadata.durationMs }),
  }
}
