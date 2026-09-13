import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { createApp } from '../../app.js'

describe('CORS limitado para clientes nativos', () => {
  it('autoriza el origen local explícito de Capacitor', async () => {
    const response = await request(
      createApp({
        corsAllowedOrigins: ['http://localhost', 'https://localhost'],
      }),
    )
      .options('/api/v1/pronunciations')
      .set('Origin', 'https://localhost')
      .set('Access-Control-Request-Method', 'POST')

    expect(response.status).toBe(204)
    expect(response.headers['access-control-allow-origin']).toBe('https://localhost')
    expect(response.headers['access-control-allow-methods']).toBe('GET,POST,OPTIONS')
    expect(response.headers['access-control-allow-headers']).toBe('content-type')
    expect(response.headers.vary).toBe('Origin')
  })

  it('no publica cabeceras CORS para un origen desconocido', async () => {
    const response = await request(
      createApp({ corsAllowedOrigins: ['http://localhost'] }),
    )
      .get('/api/v1/health')
      .set('Origin', 'https://malicioso.example')

    expect(response.status).toBe(200)
    expect(response.headers['access-control-allow-origin']).toBeUndefined()
    expect(response.headers['access-control-allow-methods']).toBeUndefined()
    expect(response.headers['access-control-allow-headers']).toBeUndefined()
    expect(response.headers.vary).toBeUndefined()
  })
})
