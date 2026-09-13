import type { PronunciationResponse } from '@smarttalky/types'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'

import { createApp } from '../../../app.js'
import type { LookupPronunciation } from '../application/get-pronunciation.js'

describe('POST /api/v1/pronunciations', () => {
  it('responde datos educativos y audios simulados sin usar red', async () => {
    const response = await request(createApp())
      .post('/api/v1/pronunciations')
      .send({
        text: 'comfortable',
        locale: 'en-US',
        modes: ['natural', 'slow', 'teacher'],
      })

    expect(response.status).toBe(200)
    expect(response.body.pronunciation).toMatchObject({
      text: 'comfortable',
      kind: 'word',
      locale: 'en-US',
      translation: 'cómodo o cómoda',
    })
    expect(response.body.audio).toHaveLength(3)
    expect(response.body.audio.map((audio: { mode: string }) => audio.mode)).toEqual([
      'natural',
      'slow',
      'teacher',
    ])
  })

  it('normaliza antes de entregar la solicitud al caso de uso inyectado', async () => {
    const result: PronunciationResponse = {
      pronunciation: { text: 'Good morning', kind: 'phrase', locale: 'en-US' },
      audio: [],
    }
    const lookup = vi.fn<LookupPronunciation>().mockResolvedValue(result)
    const response = await request(createApp({ lookupPronunciation: lookup }))
      .post('/api/v1/pronunciations')
      .send({
        text: '\u00A0Good\u2003morning\u00A0',
        locale: 'en-US',
        modes: ['natural'],
      })

    expect(response.status).toBe(200)
    expect(lookup).toHaveBeenCalledWith({
      text: 'Good morning',
      locale: 'en-US',
      modes: ['natural'],
    })
    expect(response.body).toEqual(result)
  })

  it.each([
    { text: '', locale: 'en-US', modes: ['natural'] },
    { text: 'hello\nworld', locale: 'en-US', modes: ['natural'] },
    { text: 'hello', locale: 'en-GB', modes: ['natural'] },
    { text: 'hello', locale: 'en-US', modes: ['fast'] },
    { text: 'hello', locale: 'en-US', modes: ['natural'], extra: true },
  ])('responde un error seguro para solicitudes inválidas', async (body) => {
    const response = await request(createApp()).post('/api/v1/pronunciations').send(body)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'La solicitud no es válida.',
        requestId: response.headers['x-request-id'],
      },
    })
  })

  it('no expone el mensaje de un fallo inesperado', async () => {
    const lookup = vi
      .fn<LookupPronunciation>()
      .mockRejectedValue(new Error('detalle privado del proveedor'))
    const response = await request(createApp({ lookupPronunciation: lookup }))
      .post('/api/v1/pronunciations')
      .send({ text: 'hello', locale: 'en-US', modes: ['natural'] })

    expect(response.status).toBe(500)
    expect(response.text).not.toContain('detalle privado')
    expect(response.body.error.code).toBe('INTERNAL_ERROR')
  })
})
