import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'

import { createApp } from '../../../app.js'
import type { GetAudio } from '../application/get-audio.js'
import { FAKE_WAV_BYTES } from '../infrastructure/fake-wav.js'

describe('GET /api/v1/audio/:key', () => {
  it('sirve únicamente el audio asociado a una clave controlada', async () => {
    const pronunciation = await request(createApp())
      .post('/api/v1/pronunciations')
      .send({
        text: 'hello',
        locale: 'en-US',
        modes: ['natural'],
      })
    const key = pronunciation.body.audio[0].key as string
    const response = await request(createApp()).get(`/api/v1/audio/${key}`)

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/^audio\/wav/)
    expect(response.headers['content-length']).toBe(String(FAKE_WAV_BYTES.byteLength))
    expect(response.headers['x-content-type-options']).toBe('nosniff')
    expect(response.body).toBeInstanceOf(Buffer)
    expect(response.body).toHaveLength(FAKE_WAV_BYTES.byteLength)
  })

  it.each(['missing-key', 'UPPERCASE', 'a'.repeat(65)])(
    'responde el mismo 404 seguro para claves ausentes o inválidas',
    async (key) => {
      const response = await request(createApp()).get(`/api/v1/audio/${key}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toEqual({
        code: 'AUDIO_NOT_FOUND',
        message: 'El audio solicitado no existe.',
        requestId: response.headers['x-request-id'],
      })
    },
  )

  it('no consulta el caso de uso cuando la clave no cumple el formato', async () => {
    const getAudio = vi.fn<GetAudio>()
    const response = await request(createApp({ getAudio })).get('/api/v1/audio/INVALID')

    expect(response.status).toBe(404)
    expect(getAudio).not.toHaveBeenCalled()
  })
})
