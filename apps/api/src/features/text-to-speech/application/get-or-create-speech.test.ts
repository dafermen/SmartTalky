import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AudioCacheEntry, AudioCacheRepository } from './audio-cache-repository.js'
import { createGetOrCreateSpeech, toPronunciationAudio } from './get-or-create-speech.js'
import type { TextToSpeechProvider } from './text-to-speech-provider.js'
import { createInMemoryTextToSpeechMetrics } from './text-to-speech-metrics.js'

const bytes = Uint8Array.from([82, 73, 70, 70])
const config = {
  model: 'model-v1',
  voice: 'marin',
  provider: 'fake',
}
const request = { text: 'hello', locale: 'en-US', mode: 'natural' } as const

describe('createGetOrCreateSpeech', () => {
  let entries: Map<string, AudioCacheEntry>
  let repository: AudioCacheRepository
  let provider: TextToSpeechProvider
  let synthesize: ReturnType<typeof vi.fn<TextToSpeechProvider['synthesize']>>

  beforeEach(() => {
    entries = new Map()
    repository = {
      async findByKey(key) {
        return entries.get(key)
      },
      async save(entry) {
        entries.set(entry.metadata.key, entry)
      },
    }
    synthesize = vi.fn<TextToSpeechProvider['synthesize']>().mockResolvedValue({
      bytes,
      metadata: {
        mimeType: 'audio/wav',
        provider: 'fake',
        model: 'model-v1',
        voice: 'marin',
      },
    })
    provider = { synthesize }
  })

  it('genera y persiste una sola vez en un cache miss', async () => {
    const getOrCreate = createGetOrCreateSpeech({
      repository,
      provider,
      config,
      now: () => new Date('2026-07-18T12:00:00.000Z'),
    })

    const result = await getOrCreate(request)

    expect(result.cacheStatus).toBe('miss')
    expect(synthesize).toHaveBeenCalledOnce()
    expect(entries.get(result.entry.metadata.key)).toEqual(result.entry)
    expect(result.entry.metadata.createdAt).toBe('2026-07-18T12:00:00.000Z')
  })

  it('reutiliza un acierto sin llamar nuevamente al proveedor', async () => {
    const beforeGenerate = vi.fn()
    const getOrCreate = createGetOrCreateSpeech({
      repository,
      provider,
      config,
      beforeGenerate,
    })
    const first = await getOrCreate(request)
    synthesize.mockClear()

    const second = await getOrCreate(request)

    expect(second).toEqual({ entry: first.entry, cacheStatus: 'hit' })
    expect(synthesize).not.toHaveBeenCalled()
    expect(beforeGenerate).toHaveBeenCalledOnce()
  })

  it('una versión de instrucciones diferente invalida la identidad anterior', async () => {
    const first = await createGetOrCreateSpeech({
      repository,
      provider,
      config: { ...config, instructionsVersion: 'instructions-v1' },
    })(request)

    const second = await createGetOrCreateSpeech({
      repository,
      provider,
      config: { ...config, instructionsVersion: 'instructions-v2' },
    })(request)

    expect(second.entry.metadata.key).not.toBe(first.entry.metadata.key)
    expect(synthesize).toHaveBeenCalledTimes(2)
  })

  it('rechaza metadatos incompatibles antes de persistirlos', async () => {
    synthesize.mockResolvedValueOnce({
      bytes,
      metadata: {
        mimeType: 'audio/wav',
        provider: 'otro',
        model: 'model-v1',
        voice: 'marin',
      },
    })

    await expect(
      createGetOrCreateSpeech({ repository, provider, config })(request),
    ).rejects.toMatchObject({ code: 'INVALID_RESPONSE' })
    expect(entries.size).toBe(0)
  })

  it('convierte una entrada interna al contrato público sin filtrar identidad', async () => {
    const result = await createGetOrCreateSpeech({
      repository,
      provider,
      config,
    })(request)

    expect(toPronunciationAudio(result.entry)).toEqual({
      key: result.entry.metadata.key,
      mode: 'natural',
      mimeType: 'audio/wav',
      byteLength: 4,
    })
  })

  it('deduplica solicitudes concurrentes equivalentes', async () => {
    let release: (() => void) | undefined
    const pending = new Promise<void>((resolve) => {
      release = resolve
    })
    synthesize.mockImplementationOnce(async () => {
      await pending
      return {
        bytes,
        metadata: {
          mimeType: 'audio/wav',
          provider: 'fake',
          model: 'model-v1',
          voice: 'marin',
        },
      }
    })
    const getOrCreate = createGetOrCreateSpeech({ repository, provider, config })
    const requests = Array.from({ length: 8 }, () => getOrCreate(request))

    await vi.waitFor(() => expect(synthesize).toHaveBeenCalledOnce())
    release?.()
    const results = await Promise.all(requests)

    expect(new Set(results.map((result) => result.entry.metadata.key)).size).toBe(1)
    expect(synthesize).toHaveBeenCalledOnce()
  })

  it('retira una operación fallida para permitir un intento posterior', async () => {
    synthesize.mockRejectedValueOnce(new Error('fallo simulado'))
    const getOrCreate = createGetOrCreateSpeech({ repository, provider, config })

    await expect(getOrCreate(request)).rejects.toThrow('fallo simulado')
    await expect(getOrCreate(request)).resolves.toMatchObject({
      cacheStatus: 'miss',
    })
    expect(synthesize).toHaveBeenCalledTimes(2)
  })

  it('registra métricas por operación sin texto ni etiquetas', async () => {
    const metrics = createInMemoryTextToSpeechMetrics()
    const getOrCreate = createGetOrCreateSpeech({
      repository,
      provider,
      config,
      metrics,
    })

    await getOrCreate(request)
    await getOrCreate(request)
    entries.clear()
    synthesize.mockRejectedValueOnce(new Error('fallo'))
    await expect(getOrCreate(request)).rejects.toThrow('fallo')

    expect(metrics.snapshot()).toEqual({
      cacheHit: 1,
      cacheMiss: 2,
      generation: 1,
      error: 1,
    })
    expect(JSON.stringify(metrics.snapshot())).not.toContain(request.text)
  })
})
