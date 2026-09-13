import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'

import { InvalidRequestError } from '../../domain/errors/app-error.js'
import { createLogger } from '../../observability/logger.js'
import { errorHandler } from './error-handler.js'

function createFailingApp(error: unknown) {
  const logger = createLogger({ nodeEnv: 'test', logLevel: 'silent' })
  const app = express()

  app.get('/failure', (_request, _response, next) => next(error))
  app.use(errorHandler(logger))

  return { app, logger }
}

describe('errorHandler', () => {
  it('maneja null de forma segura aunque se invoque directamente', () => {
    const logger = createLogger({ nodeEnv: 'test', logLevel: 'silent' })
    const errorLog = vi.spyOn(logger, 'error')
    let statusCode: number | undefined
    let responseBody: unknown
    const response = {
      getHeader: () => undefined,
      status(code: number) {
        statusCode = code
        return this
      },
      json(body: unknown) {
        responseBody = body
        return this
      },
    } as unknown as Response

    errorHandler(logger)(null, {} as Request, response, (() => undefined) as NextFunction)

    expect(statusCode).toBe(500)
    expect(responseBody).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Ocurrió un error inesperado.',
        requestId: 'unknown',
      },
    })
    expect(errorLog).toHaveBeenCalledWith(
      { err: null, requestId: 'unknown' },
      'Error HTTP inesperado.',
    )
  })

  it.each([
    'unexpected-string',
    { status: 413, type: 'unexpected.type' },
    { status: 400, type: 'unexpected.type' },
    { status: 500, type: 'entity.too.large' },
    { status: 500, type: 'entity.parse.failed' },
  ])('trata como interno un error no reconocido: %o', async (error) => {
    const { app, logger } = createFailingApp(error)
    const errorLog = vi.spyOn(logger, 'error')
    const response = await request(app).get('/failure')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Ocurrió un error inesperado.',
        requestId: 'unknown',
      },
    })
    expect(errorLog).toHaveBeenCalledWith(
      { err: error, requestId: 'unknown' },
      'Error HTTP inesperado.',
    )
  })

  it('registra contexto técnico mínimo para un error operativo', async () => {
    const error = new InvalidRequestError()
    const { app, logger } = createFailingApp(error)
    const warning = vi.spyOn(logger, 'warn')
    const response = await request(app).get('/failure')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'La solicitud no es válida.',
        requestId: 'unknown',
      },
    })
    expect(warning).toHaveBeenCalledWith(
      {
        errorCode: 'INVALID_REQUEST',
        statusCode: 400,
        requestId: 'unknown',
      },
      'La solicitud no es válida.',
    )
  })
})
