import { describe, expect, it, vi } from 'vitest'

import {
  TextToSpeechProviderError,
  type TextToSpeechProvider,
} from './text-to-speech-provider.js'
import { createResilientTextToSpeechProvider } from './resilient-text-to-speech-provider.js'

const request = { text: 'hello', locale: 'en-US', mode: 'natural' } as const
const result = {
  bytes: Uint8Array.from([1]),
  metadata: {
    mimeType: 'audio/wav' as const,
    provider: 'fake',
    model: 'fake-v1',
    voice: 'fake',
  },
}

describe('proveedor TTS resiliente', () => {
  it('reintenta solo fallos recuperables hasta obtener éxito', async () => {
    const synthesize = vi
      .fn<TextToSpeechProvider['synthesize']>()
      .mockRejectedValueOnce(
        new TextToSpeechProviderError('REQUEST_FAILED', 'temporal', {
          retryable: true,
        }),
      )
      .mockResolvedValue(result)
    const sleep = vi.fn<(milliseconds: number) => Promise<void>>().mockResolvedValue()
    const provider = createResilientTextToSpeechProvider(
      { synthesize },
      { timeoutMs: 1000, maxRetries: 2, retryDelayMs: 5, sleep },
    )

    await expect(provider.synthesize(request)).resolves.toEqual(result)
    expect(synthesize).toHaveBeenCalledTimes(2)
    expect(sleep).toHaveBeenCalledWith(5)
  })

  it('no reintenta fallos permanentes', async () => {
    const failure = new TextToSpeechProviderError('INVALID_RESPONSE', 'permanente', {
      retryable: false,
    })
    const synthesize = vi
      .fn<TextToSpeechProvider['synthesize']>()
      .mockRejectedValue(failure)
    const provider = createResilientTextToSpeechProvider(
      { synthesize },
      { timeoutMs: 1000, maxRetries: 3 },
    )

    await expect(provider.synthesize(request)).rejects.toBe(failure)
    expect(synthesize).toHaveBeenCalledOnce()
  })

  it('aborta y clasifica un timeout como recuperable pero acotado', async () => {
    vi.useFakeTimers()
    const synthesize = vi.fn<TextToSpeechProvider['synthesize']>().mockImplementation(
      async (_request, signal) =>
        new Promise((_resolve, reject) => {
          signal?.addEventListener('abort', () => reject(new Error('abortado')))
        }),
    )
    const provider = createResilientTextToSpeechProvider(
      { synthesize },
      { timeoutMs: 25, maxRetries: 0 },
    )
    const rejection = expect(provider.synthesize(request)).rejects.toMatchObject({
      code: 'REQUEST_FAILED',
      retryable: true,
    })
    await vi.advanceTimersByTimeAsync(25)

    await rejection
    expect(synthesize).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })

  it('respeta la cancelación del llamador sin reintentar', async () => {
    const controller = new AbortController()
    const synthesize = vi
      .fn<TextToSpeechProvider['synthesize']>()
      .mockImplementation(async (_request, signal) => {
        controller.abort('usuario')
        throw new TextToSpeechProviderError('REQUEST_ABORTED', 'cancelada', {
          retryable: false,
          cause: signal?.reason,
        })
      })
    const provider = createResilientTextToSpeechProvider(
      { synthesize },
      { timeoutMs: 1000, maxRetries: 2 },
    )

    await expect(provider.synthesize(request, controller.signal)).rejects.toMatchObject({
      code: 'REQUEST_ABORTED',
    })
    expect(synthesize).toHaveBeenCalledOnce()
  })
})
