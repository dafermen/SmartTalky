import type { PronunciationProvider } from '../../pronunciation/application/get-pronunciation.js'
import { describe, expect, it, vi } from 'vitest'

import type {
  EducationalContentCache,
  EducationalContentCacheEntry,
} from './educational-content-cache.js'
import { createFallbackEducationalContentProvider } from './fallback-educational-content-provider.js'
import { createCachedEducationalContentProvider } from './get-or-create-educational-content.js'

const request = { text: 'world', locale: 'en-US' as const, modes: [] }
const response = {
  pronunciation: {
    text: 'world',
    kind: 'word' as const,
    locale: 'en-US' as const,
    ipa: '/wɝld/',
    syllables: [{ text: 'world', stressed: true }],
    translation: 'mundo',
    example: 'The world is changing.',
    exampleTranslation: 'El mundo está cambiando.',
  },
  audio: [],
}

function memoryCache(): EducationalContentCache {
  const entries = new Map<string, EducationalContentCacheEntry>()
  return {
    async findByKey(key) {
      return entries.get(key)
    },
    async put(key, entry) {
      entries.set(key, entry)
    },
  }
}

describe('contenido educativo cacheado', () => {
  it('genera una vez y reutiliza el resultado', async () => {
    const lookup = vi.fn<PronunciationProvider['lookup']>().mockResolvedValue(response)
    const provider = createCachedEducationalContentProvider({
      provider: { lookup },
      cache: memoryCache(),
      model: 'gpt-5.6',
      promptVersion: 'v1',
    })

    await expect(provider.lookup(request)).resolves.toEqual(response)
    await expect(provider.lookup(request)).resolves.toEqual(response)
    expect(lookup).toHaveBeenCalledTimes(1)
  })

  it('deduplica solicitudes simultáneas', async () => {
    const lookup = vi
      .fn<PronunciationProvider['lookup']>()
      .mockImplementation(async () => response)
    const provider = createCachedEducationalContentProvider({
      provider: { lookup },
      cache: memoryCache(),
      model: 'gpt-5.6',
      promptVersion: 'v1',
    })

    await Promise.all(Array.from({ length: 8 }, () => provider.lookup(request)))
    expect(lookup).toHaveBeenCalledTimes(1)
  })

  it('usa el respaldo sin guardar un fallo como resultado definitivo', async () => {
    const primary = {
      lookup: vi.fn<PronunciationProvider['lookup']>().mockRejectedValue(new Error()),
    }
    const fallback = {
      lookup: vi.fn<PronunciationProvider['lookup']>().mockResolvedValue(response),
    }
    const provider = createFallbackEducationalContentProvider(primary, fallback)

    await expect(provider.lookup(request)).resolves.toEqual(response)
    expect(fallback.lookup).toHaveBeenCalledOnce()
  })

  it('consume presupuesto únicamente antes de una generación', async () => {
    const beforeGenerate = vi.fn()
    const lookup = vi.fn<PronunciationProvider['lookup']>().mockResolvedValue(response)
    const provider = createCachedEducationalContentProvider({
      provider: { lookup },
      cache: memoryCache(),
      model: 'gpt-5.6',
      promptVersion: 'v1',
      beforeGenerate,
    })

    await provider.lookup(request)
    await provider.lookup(request)

    expect(beforeGenerate).toHaveBeenCalledOnce()
  })
})
