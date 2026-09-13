import type { PronunciationResponse } from '@smarttalky/types'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { lookupApiPronunciation, PronunciationApiError } from './pronunciation-api'

const validResponse: PronunciationResponse = {
  pronunciation: {
    text: 'hello',
    kind: 'word',
    locale: 'en-US',
    ipa: '/həˈloʊ/',
  },
  audio: [
    {
      key: 'mock-natural',
      mode: 'natural',
      mimeType: 'audio/wav',
      byteLength: 44,
    },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('lookupApiPronunciation', () => {
  it('envía el contrato completo, reenvía la cancelación y valida la respuesta', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(validResponse), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()

    await expect(lookupApiPronunciation('hello', controller.signal)).resolves.toEqual({
      entry: validResponse.pronunciation,
      audio: validResponse.audio,
    })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/pronunciations',
      expect.objectContaining({
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify({
          text: 'hello',
          locale: 'en-US',
          modes: ['natural', 'slow', 'teacher'],
        }),
      }),
    )
  })

  it('convierte un estado HTTP fallido en un error de aplicación', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 500 })),
    )

    await expect(lookupApiPronunciation('hello')).rejects.toBeInstanceOf(
      PronunciationApiError,
    )
  })

  it('rechaza respuestas que no cumplen el contrato compartido', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ pronunciation: { text: 'hello' } }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      ),
    )

    await expect(lookupApiPronunciation('hello')).rejects.toThrow(
      'La API devolvió una respuesta no válida.',
    )
  })
})
