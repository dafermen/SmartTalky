import type { ErrorRequestHandler, RequestHandler } from 'express'
import type { Logger } from 'pino'

import {
  AppError,
  InvalidRequestError,
  NotFoundError,
  PayloadTooLargeError,
} from '../../domain/errors/app-error.js'

function parserError(error: unknown): AppError | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const candidate = error as { status?: unknown; type?: unknown }

  if (candidate.status === 413 && candidate.type === 'entity.too.large') {
    return new PayloadTooLargeError()
  }
  if (candidate.status === 400 && candidate.type === 'entity.parse.failed') {
    return new InvalidRequestError()
  }
  return undefined
}

/** Convierte rutas desconocidas en un error operativo consistente. */
export const notFoundHandler: RequestHandler = (_request, _response, next) => {
  next(new NotFoundError())
}

/**
 * Traduce errores a un contrato HTTP seguro y registra solo contexto técnico mínimo.
 * Los errores inesperados nunca exponen su mensaje o traza al cliente.
 */
export function errorHandler(logger: Logger): ErrorRequestHandler {
  return (error: unknown, _request, response, _next) => {
    const requestId = String(response.getHeader('x-request-id') ?? 'unknown')

    const safeError = error instanceof AppError ? error : parserError(error)

    if (safeError !== undefined) {
      logger.warn(
        {
          errorCode: safeError.code,
          statusCode: safeError.statusCode,
          requestId,
        },
        safeError.message,
      )
      response.status(safeError.statusCode).json({
        error: {
          code: safeError.code,
          message: safeError.message,
          requestId,
        },
      })
      return
    }

    logger.error({ err: error, requestId }, 'Error HTTP inesperado.')
    response.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Ocurrió un error inesperado.',
        requestId,
      },
    })
  }
}
