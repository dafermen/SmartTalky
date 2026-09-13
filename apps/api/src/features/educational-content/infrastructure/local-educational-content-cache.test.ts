import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { afterEach, describe, expect, it } from 'vitest'

import { createLocalEducationalContentCache } from './local-educational-content-cache.js'

const directories: string[] = []
const key = 'a'.repeat(64)
const entry = {
  entry: {
    text: 'world',
    kind: 'word' as const,
    locale: 'en-US' as const,
    ipa: '/wɝld/',
    syllables: [{ text: 'world', stressed: true }],
    translation: 'mundo',
    example: 'The world is beautiful.',
    exampleTranslation: 'El mundo es hermoso.',
  },
  model: 'gpt-5.6',
  promptVersion: 'v1',
  createdAt: '2026-07-25T00:00:00.000Z',
}

async function createCache() {
  const directory = await mkdtemp(join(tmpdir(), 'smarttalky-educational-'))
  directories.push(directory)
  return { directory, cache: createLocalEducationalContentCache(directory) }
}

afterEach(async () => {
  await Promise.all(
    directories.splice(0).map((directory) => rm(directory, { recursive: true })),
  )
})

describe('caché educativa local', () => {
  it('persiste y recupera una entrada validada', async () => {
    const { cache } = await createCache()
    await cache.put(key, entry)
    await expect(cache.findByKey(key)).resolves.toEqual(entry)
  })

  it('trata contenido corrupto como cache miss', async () => {
    const { directory, cache } = await createCache()
    await writeFile(join(directory, `${key}.json`), '{no-json', 'utf8')
    await expect(cache.findByKey(key)).resolves.toBeUndefined()
  })

  it('rechaza claves que podrían formar rutas', async () => {
    const { cache } = await createCache()
    await expect(cache.put('../escape', entry)).rejects.toThrow()
  })

  it('conserva las entradas más recientes al alcanzar el máximo', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'smarttalky-educational-'))
    directories.push(directory)
    const cache = createLocalEducationalContentCache(directory, {
      maximumEntries: 1,
    })
    const secondKey = 'b'.repeat(64)

    await cache.put(key, entry)
    await new Promise((resolve) => setTimeout(resolve, 10))
    await cache.put(secondKey, {
      ...entry,
      entry: { ...entry.entry, text: 'second' },
    })

    await expect(cache.findByKey(key)).resolves.toBeUndefined()
    await expect(cache.findByKey(secondKey)).resolves.toMatchObject({
      entry: { text: 'second' },
    })
  })
})
