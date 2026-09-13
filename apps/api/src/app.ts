import express, { type Express } from 'express'
import type { Logger } from 'pino'

import { createGetAudio, type GetAudio } from './features/audio/application/get-audio.js'
import { createAudioRouter } from './features/audio/http/audio-router.js'
import { fakeAudioRepository } from './features/audio/infrastructure/fake-audio-repository.js'
import { errorHandler, notFoundHandler } from './http/middleware/error-handler.js'
import { requestLogger } from './http/middleware/request-logger.js'
import { createRateLimit } from './http/middleware/rate-limit.js'
import { createCors } from './http/middleware/cors.js'
import { securityHeaders } from './http/middleware/security-headers.js'
import { healthRouter } from './http/routes/health.js'
import { createLogger } from './observability/logger.js'
import { openApiRouter } from './openapi/openapi-router.js'
import {
  createLookupPronunciation,
  type LookupPronunciation,
} from './features/pronunciation/application/get-pronunciation.js'
import { fakePronunciationProvider } from './features/pronunciation/infrastructure/fake-pronunciation-provider.js'
import { createPronunciationRouter } from './features/pronunciation/http/pronunciation-router.js'

interface AppDependencies {
  getAudio?: GetAudio
  logger?: Logger
  lookupPronunciation?: LookupPronunciation
  rateLimit?: { maxRequests: number; windowMs: number }
  corsAllowedOrigins?: readonly string[]
  trustProxyHops?: number
}

/**
 * Construye la aplicación HTTP sin abrir un puerto.
 *
 * Separar la aplicación del proceso permite probar rutas con Supertest y evita
 * que importar un módulo durante las pruebas deje conexiones abiertas.
 */
export function createApp(dependencies: AppDependencies = {}): Express {
  const app = express()
  const logger =
    dependencies.logger ?? createLogger({ logLevel: 'silent', nodeEnv: 'test' })
  const lookupPronunciation =
    dependencies.lookupPronunciation ??
    createLookupPronunciation(fakePronunciationProvider)
  const getAudio = dependencies.getAudio ?? createGetAudio(fakeAudioRepository)
  const rateLimit = dependencies.rateLimit ?? {
    maxRequests: 30,
    windowMs: 60_000,
  }

  app.disable('x-powered-by')
  if ((dependencies.trustProxyHops ?? 0) > 0) {
    app.set('trust proxy', dependencies.trustProxyHops)
  }
  app.use(securityHeaders)
  app.use(createCors(dependencies.corsAllowedOrigins ?? []))
  app.use(requestLogger(logger))
  app.use(express.json({ limit: '32kb' }))
  app.use('/api/v1/health', healthRouter)
  app.use('/api/v1/openapi.json', openApiRouter)
  app.use(
    '/api/v1/pronunciations',
    createRateLimit(rateLimit),
    createPronunciationRouter({ lookupPronunciation }),
  )
  app.use('/api/v1/audio', createAudioRouter({ getAudio }))
  app.use(notFoundHandler)
  app.use(errorHandler(logger))

  return app
}
