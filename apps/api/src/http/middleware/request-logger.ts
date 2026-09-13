import { randomUUID } from 'node:crypto'
import { performance } from 'node:perf_hooks'

import type { RequestHandler } from 'express'
import type { Logger } from 'pino'

/** Registra metadatos mínimos de cada solicitud sin cuerpo, query ni autorización. */
export function requestLogger(logger: Logger): RequestHandler {
  return (request, response, next) => {
    const requestId = randomUUID()
    const startedAt = performance.now()

    response.setHeader('x-request-id', requestId)
    response.once('finish', () => {
      logger.info(
        {
          request: {
            id: requestId,
            method: request.method,
            path: request.path,
          },
          response: { statusCode: response.statusCode },
          durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
        },
        'Solicitud HTTP completada.',
      )
    })

    next()
  }
}
