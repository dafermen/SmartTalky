import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { createApp } from './app.js'

describe('createApp', () => {
  it('solo confía en proxies cuando se configura una cantidad explícita', () => {
    expect(createApp().get('trust proxy')).toBe(false)
    expect(createApp({ trustProxyHops: 2 }).get('trust proxy')).toBe(2)
  })

  it('informa salud sin revelar detalles internos', async () => {
    const response = await request(createApp()).get('/api/v1/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok', service: 'smarttalky-api' })
    expect(response.headers['x-powered-by']).toBeUndefined()
    expect(response.headers['x-request-id']).toEqual(expect.any(String))
    expect(response.headers).toMatchObject({
      'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
      'permissions-policy': 'camera=(), microphone=(), geolocation=()',
      'referrer-policy': 'no-referrer',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
    })
  })

  it('rechaza JSON malformado sin exponer el cuerpo recibido', async () => {
    const response = await request(createApp())
      .post('/api/v1/pronunciations')
      .set('content-type', 'application/json')
      .send('{"text":"secreto-incompleto"')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'La solicitud no es válida.',
        requestId: response.headers['x-request-id'],
      },
    })
    expect(JSON.stringify(response.body)).not.toContain('secreto-incompleto')
  })

  it('rechaza cuerpos mayores de 32 KiB con un error seguro', async () => {
    const response = await request(createApp())
      .post('/api/v1/pronunciations')
      .send({ text: 'a'.repeat(33 * 1024) })

    expect(response.status).toBe(413)
    expect(response.body).toEqual({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'La solicitud supera el tamaño permitido.',
        requestId: response.headers['x-request-id'],
      },
    })
  })

  it('responde un error consistente para rutas desconocidas', async () => {
    const response = await request(createApp()).get('/')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: {
        code: 'RESOURCE_NOT_FOUND',
        message: 'El recurso solicitado no existe.',
        requestId: response.headers['x-request-id'],
      },
    })
  })
})
