import {
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  unlink,
  utimes,
  writeFile,
} from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

import { pronunciationEntrySchema } from '@smarttalky/shared'
import { z } from 'zod'

import type {
  EducationalContentCache,
  EducationalContentCacheEntry,
} from '../application/educational-content-cache.js'

const MAX_CACHE_FILE_BYTES = 64 * 1024
const DEFAULT_MAXIMUM_CACHE_ENTRIES = 10_000
const keySchema = z.string().regex(/^[a-f0-9]{64}$/)
const cacheEntrySchema: z.ZodType<EducationalContentCacheEntry> = z.strictObject({
  entry: pronunciationEntrySchema,
  model: z.string().min(1).max(100),
  promptVersion: z.string().min(1).max(100),
  createdAt: z.iso.datetime(),
})

export function createLocalEducationalContentCache(
  rootDirectory: string,
  options: { maximumEntries?: number } = {},
): EducationalContentCache {
  const root = resolve(rootDirectory)
  const maximumEntries = options.maximumEntries ?? DEFAULT_MAXIMUM_CACHE_ENTRIES
  if (!Number.isInteger(maximumEntries) || maximumEntries <= 0) {
    throw new Error('El límite de caché educativa no es válido.')
  }

  function pathFor(key: string) {
    const safeKey = keySchema.parse(key)
    return join(root, `${safeKey}.json`)
  }

  async function prune(): Promise<void> {
    const candidates = (await readdir(root).catch(() => [])).filter((name) =>
      /^[a-f0-9]{64}\.json$/.test(name),
    )
    if (candidates.length <= maximumEntries) return

    const entries = await Promise.all(
      candidates.map(async (name) => ({
        name,
        modifiedAt: (await stat(join(root, name))).mtimeMs,
      })),
    )
    entries.sort((left, right) => left.modifiedAt - right.modifiedAt)
    await Promise.all(
      entries
        .slice(0, entries.length - maximumEntries)
        .map(({ name }) => unlink(join(root, name)).catch(() => undefined)),
    )
  }

  return {
    async findByKey(key) {
      try {
        const raw = await readFile(pathFor(key))
        if (raw.byteLength > MAX_CACHE_FILE_BYTES) {
          return undefined
        }
        const entry = cacheEntrySchema.parse(JSON.parse(raw.toString('utf8')))
        const accessedAt = new Date()
        await utimes(pathFor(key), accessedAt, accessedAt).catch(() => undefined)
        return entry
      } catch {
        return undefined
      }
    },

    async put(key, entry) {
      const target = pathFor(key)
      const temporary = `${target}.${crypto.randomUUID()}.tmp`
      const serialized = JSON.stringify(cacheEntrySchema.parse(entry))
      if (Buffer.byteLength(serialized, 'utf8') > MAX_CACHE_FILE_BYTES) {
        throw new Error('El contenido educativo excede el máximo permitido.')
      }

      await mkdir(dirname(target), { recursive: true })
      try {
        await writeFile(temporary, serialized, { encoding: 'utf8', flag: 'wx' })
        await rename(temporary, target)
        await prune().catch(() => undefined)
      } catch (error) {
        await unlink(temporary).catch(() => undefined)
        throw error
      }
    },
  }
}
