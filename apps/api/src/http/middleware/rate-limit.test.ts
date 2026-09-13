import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { createLogger } from '../../observability/logger.js'
import { errorHandler } from './error-handler.js'
import { createRateLimit } from './rate-limit.js'

describe('createRateLimit', () => {
  it('responde 429 de forma segura al superar el límite', async () => {
    const app = express()
    app.use(createRateLimit({ maxRequests: 2, windowMs: 60_000 }))
    app.get('/limited', (_request, response) => response.sendStatus(204))
    app.use(errorHandler(createLogger({ nodeEnv: 'test', logLevel: 'silent' })))

    const first = await request(app).get('/limited')
    const second = await request(app).get('/limited')
    const blocked = await request(app).get('/limited')

    expect(first.status).toBe(204)
    expect(first.headers['x-ratelimit-remaining']).toBe('1')
    expect(second.status).toBe(204)
    expect(second.headers['x-ratelimit-remaining']).toBe('0')
    expect(blocked.status).toBe(429)
    expect(blocked.headers['x-ratelimit-remaining']).toBe('0')
    expect(blocked.headers['retry-after']).toBe('60')
    expect(blocked.body.error).toEqual({
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Hay demasiadas solicitudes. Inténtelo de nuevo más tarde.',
      requestId: 'unknown',
    })
  })

  it('abre una ventana nueva después del plazo configurado', async () => {
    let timestamp = 1000
    const app = express()
    app.use(
      createRateLimit({
        maxRequests: 1,
        windowMs: 1000,
        now: () => timestamp,
      }),
    )
    app.get('/', (_request, response) => response.sendStatus(204))
    app.use(errorHandler(createLogger({ nodeEnv: 'test', logLevel: 'silent' })))

    expect((await request(app).get('/')).status).toBe(204)
    expect((await request(app).get('/')).status).toBe(429)
    timestamp = 2000
    expect((await request(app).get('/')).status).toBe(204)
  })

  it.each([
    { maxRequests: 0, windowMs: 1 },
    { maxRequests: -1, windowMs: 1 },
    { maxRequests: 1, windowMs: 0 },
    { maxRequests: 1, windowMs: -1 },
  ])('rechaza cada configuración insegura: %o', (options) => {
    expect(() => createRateLimit(options)).toThrow(
      new Error('La configuración de rate limit no es válida.'),
    )
  })

  it('acepta los mínimos configurables de una solicitud y un milisegundo', () => {
    expect(createRateLimit({ maxRequests: 1, windowMs: 1, now: () => 0 })).toEqual(
      expect.any(Function),
    )
  })

  it('mantiene ventanas independientes para direcciones IP distintas', async () => {
    const app = express()
    app.set('trust proxy', true)
    app.use(createRateLimit({ maxRequests: 1, windowMs: 60_000 }))
    app.get('/', (_request, response) => response.sendStatus(204))
    app.use(errorHandler(createLogger({ nodeEnv: 'test', logLevel: 'silent' })))

    expect((await request(app).get('/').set('X-Forwarded-For', '192.0.2.1')).status).toBe(
      204,
    )
    expect((await request(app).get('/').set('X-Forwarded-For', '192.0.2.2')).status).toBe(
      204,
    )
    expect((await request(app).get('/').set('X-Forwarded-For', '192.0.2.1')).status).toBe(
      429,
    )
  })
})
