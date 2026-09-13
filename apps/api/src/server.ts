import type { Server } from 'node:http'
import { fileURLToPath } from 'node:url'

import { createApp } from './app.js'
import { loadConfig } from './config/environment.js'
import { createGetAudio } from './features/audio/application/get-audio.js'
import { createCachedEducationalContentProvider } from './features/educational-content/application/get-or-create-educational-content.js'
import { createFallbackEducationalContentProvider } from './features/educational-content/application/fallback-educational-content-provider.js'
import { createLocalEducationalContentCache } from './features/educational-content/infrastructure/local-educational-content-cache.js'
import {
  createOpenAiEducationalContentProvider,
  EDUCATIONAL_PROMPT_VERSION,
} from './features/educational-content/infrastructure/openai-educational-content-provider.js'
import { createLookupPronunciation } from './features/pronunciation/application/get-pronunciation.js'
import { createCachingPronunciationProvider } from './features/pronunciation/infrastructure/caching-pronunciation-provider.js'
import { fakePronunciationProvider } from './features/pronunciation/infrastructure/fake-pronunciation-provider.js'
import { createGetOrCreateSpeech } from './features/text-to-speech/application/get-or-create-speech.js'
import { createResilientTextToSpeechProvider } from './features/text-to-speech/application/resilient-text-to-speech-provider.js'
import { createInMemoryTextToSpeechMetrics } from './features/text-to-speech/application/text-to-speech-metrics.js'
import {
  createOpenAiTextToSpeechProvider,
  DEFAULT_OPENAI_TTS_MODEL,
  DEFAULT_OPENAI_TTS_VOICE,
} from './features/text-to-speech/infrastructure/openai-text-to-speech-provider.js'
import { createLocalAudioCacheRepository } from './features/text-to-speech/infrastructure/local-audio-cache-repository.js'
import { fakeTextToSpeechProvider } from './features/text-to-speech/infrastructure/fake-text-to-speech-provider.js'
import { createLogger } from './observability/logger.js'
import { createInMemoryProviderGenerationBudget } from './observability/provider-generation-budget.js'

/** Cierra el servidor una sola vez cuando el proceso recibe una señal. */
function registerGracefulShutdown(
  server: Server,
  logger: ReturnType<typeof createLogger>,
): void {
  let isClosing = false

  const closeServer = (signal: NodeJS.Signals): void => {
    if (isClosing) {
      return
    }

    isClosing = true
    logger.info({ signal }, 'Cerrando SmartTalky API.')
    server.close((error) => {
      if (error) {
        logger.error({ err: error }, 'No fue posible cerrar el servidor correctamente.')
        process.exitCode = 1
      }
    })
  }

  process.once('SIGINT', closeServer)
  process.once('SIGTERM', closeServer)
}

const config = loadConfig()
const logger = createLogger(config)
const runtimeDependencies = (() => {
  if (config.openAiApiKey === undefined && !config.cachedFakeProviderEnabled) {
    return {}
  }

  const usesFakeProvider = config.openAiApiKey === undefined

  const generationBudget = createInMemoryProviderGenerationBudget({
    maximum: config.providerGenerationBudgetMaximum,
    windowMs: config.providerGenerationBudgetWindowMs,
    onExceeded(snapshot) {
      logger.warn(
        { remaining: snapshot.remaining, resetsAt: snapshot.resetsAt },
        'Presupuesto temporal de generaciones externas agotado.',
      )
    },
  })
  const cache = createLocalAudioCacheRepository(
    fileURLToPath(new URL('../../../storage/audio-cache/', import.meta.url)),
    { maximumBytes: config.audioCacheMaximumBytes },
  )
  const educationalCache = createLocalEducationalContentCache(
    fileURLToPath(new URL('../../../storage/educational-cache/', import.meta.url)),
    { maximumEntries: config.educationalCacheMaximumEntries },
  )
  const educationalProvider = usesFakeProvider
    ? fakePronunciationProvider
    : createFallbackEducationalContentProvider(
        createCachedEducationalContentProvider({
          provider: createOpenAiEducationalContentProvider({
            apiKey: config.openAiApiKey,
            model: config.educationalModel,
            timeoutMs: config.educationalTimeoutMs,
          }),
          cache: educationalCache,
          model: config.educationalModel,
          promptVersion: EDUCATIONAL_PROMPT_VERSION,
          beforeGenerate: () => generationBudget.consume('educational-content'),
        }),
        fakePronunciationProvider,
      )
  const provider = usesFakeProvider
    ? fakeTextToSpeechProvider
    : createResilientTextToSpeechProvider(
        createOpenAiTextToSpeechProvider({ apiKey: config.openAiApiKey }),
        {
          timeoutMs: config.ttsTimeoutMs,
          maxRetries: config.ttsMaxRetries,
        },
      )
  const metrics = createInMemoryTextToSpeechMetrics()
  const getOrCreateSpeech = createGetOrCreateSpeech({
    repository: cache,
    provider,
    metrics,
    beforeGenerate: usesFakeProvider
      ? undefined
      : () => generationBudget.consume('text-to-speech'),
    config: {
      model: usesFakeProvider ? 'fake-tts-v1' : DEFAULT_OPENAI_TTS_MODEL,
      voice: usesFakeProvider ? 'fake-en-us' : DEFAULT_OPENAI_TTS_VOICE,
      provider: usesFakeProvider ? 'fake' : 'openai',
    },
  })

  return {
    lookupPronunciation: createLookupPronunciation(
      createCachingPronunciationProvider(educationalProvider, getOrCreateSpeech),
    ),
    getAudio: createGetAudio({
      async findByKey(key) {
        if (!/^[a-f0-9]{64}$/.test(key)) {
          return undefined
        }
        const entry = await cache.findByKey(key)
        return entry === undefined
          ? undefined
          : { bytes: entry.bytes, mimeType: entry.metadata.mimeType }
      },
    }),
  }
})()
const app = createApp({
  logger,
  ...runtimeDependencies,
  corsAllowedOrigins: config.corsAllowedOrigins,
  trustProxyHops: config.trustProxyHops,
  rateLimit: {
    maxRequests: config.pronunciationRateLimitMax,
    windowMs: config.pronunciationRateLimitWindowMs,
  },
})
const server = app.listen(config.port, config.host, () => {
  logger.info({ host: config.host, port: config.port }, 'SmartTalky API disponible.')
})

registerGracefulShutdown(server, logger)
