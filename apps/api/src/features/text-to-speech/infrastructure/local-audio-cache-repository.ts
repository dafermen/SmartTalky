import { randomUUID } from 'node:crypto'
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  utimes,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'

import { z } from 'zod'

import { MAX_AUDIO_BYTE_LENGTH } from '../../audio/application/get-audio.js'
import {
  AUDIO_METADATA_SCHEMA_VERSION,
  type AudioCacheEntry,
  type AudioCacheMetadata,
  type AudioCacheRepository,
} from '../application/audio-cache-repository.js'
import { createAudioKey } from '../domain/audio-identity.js'

const AUDIO_KEY_PATTERN = /^[a-f0-9]{64}$/
const DEFAULT_MAXIMUM_CACHE_BYTES = 512 * 1024 * 1024

const metadataSchema = z
  .object({
    schemaVersion: z.literal(AUDIO_METADATA_SCHEMA_VERSION),
    key: z.string().regex(AUDIO_KEY_PATTERN),
    identity: z
      .object({
        text: z.string(),
        locale: z.string().min(1),
        voice: z.string().min(1),
        mode: z.enum(['natural', 'slow', 'teacher']),
        speed: z.number().positive().finite(),
        model: z.string().min(1),
        instructionsVersion: z.string().min(1),
      })
      .strict(),
    mimeType: z.enum(['audio/mpeg', 'audio/wav']),
    byteLength: z.number().int().positive().max(MAX_AUDIO_BYTE_LENGTH),
    createdAt: z.iso.datetime(),
    provider: z.string().min(1),
    durationMs: z.number().int().nonnegative().optional(),
  })
  .strict()

function validateKey(key: string): void {
  if (!AUDIO_KEY_PATTERN.test(key)) {
    throw new Error('La clave de caché de audio no es válida.')
  }
}

function validateEntry(entry: AudioCacheEntry): AudioCacheMetadata {
  const metadata = metadataSchema.parse(entry.metadata)

  if (
    createAudioKey(metadata.identity) !== metadata.key ||
    entry.bytes.byteLength !== metadata.byteLength
  ) {
    throw new Error('La entrada de caché de audio no es consistente.')
  }

  return metadata
}

function pathsFor(rootDirectory: string, key: string) {
  validateKey(key)
  return {
    audio: path.join(rootDirectory, `${key}.audio`),
    metadata: path.join(rootDirectory, `${key}.json`),
  }
}

async function pruneAudioCache(root: string, maximumBytes: number): Promise<void> {
  const names = await readdir(root).catch(() => [])
  const keys = [
    ...new Set(
      names
        .map((name) => /^([a-f0-9]{64})\.(?:audio|json)$/.exec(name)?.[1])
        .filter((key): key is string => key !== undefined),
    ),
  ]
  const entries = (
    await Promise.all(
      keys.map(async (key) => {
        const paths = pathsFor(root, key)
        try {
          const [audio, metadata] = await Promise.all([
            stat(paths.audio),
            stat(paths.metadata),
          ])
          return {
            key,
            bytes: audio.size + metadata.size,
            lastAccessMs: Math.max(audio.mtimeMs, metadata.mtimeMs),
          }
        } catch {
          return undefined
        }
      }),
    )
  )
    .filter(
      (entry): entry is { key: string; bytes: number; lastAccessMs: number } =>
        entry !== undefined,
    )
    .sort((left, right) => left.lastAccessMs - right.lastAccessMs)

  let totalBytes = entries.reduce((total, entry) => total + entry.bytes, 0)
  for (const entry of entries) {
    if (totalBytes <= maximumBytes) break
    const paths = pathsFor(root, entry.key)
    await Promise.allSettled([
      rm(paths.audio, { force: true }),
      rm(paths.metadata, { force: true }),
    ])
    totalBytes -= entry.bytes
  }
}

/** Repositorio local limitado a nombres derivados de una clave SHA-256 validada. */
export function createLocalAudioCacheRepository(
  rootDirectory: string,
  options: { maximumBytes?: number } = {},
): AudioCacheRepository {
  const root = path.resolve(rootDirectory)
  const maximumBytes = options.maximumBytes ?? DEFAULT_MAXIMUM_CACHE_BYTES
  if (!Number.isInteger(maximumBytes) || maximumBytes <= 0) {
    throw new Error('El límite de caché de audio no es válido.')
  }

  return {
    async findByKey(key) {
      const paths = pathsFor(root, key)

      try {
        const [rawMetadata, bytes] = await Promise.all([
          readFile(paths.metadata, 'utf8'),
          readFile(paths.audio),
        ])
        const metadata = metadataSchema.parse(JSON.parse(rawMetadata))
        const entry: AudioCacheEntry = {
          bytes: new Uint8Array(bytes),
          metadata,
        }

        validateEntry(entry)
        const accessedAt = new Date()
        await Promise.allSettled([
          utimes(paths.audio, accessedAt, accessedAt),
          utimes(paths.metadata, accessedAt, accessedAt),
        ])
        return entry
      } catch (error) {
        if (error instanceof Error && error.message.includes('clave de caché')) {
          throw error
        }
        return undefined
      }
    },

    async save(entry) {
      const metadata = validateEntry(entry)
      const paths = pathsFor(root, metadata.key)
      const nonce = randomUUID()
      const temporaryAudio = `${paths.audio}.${nonce}.tmp`
      const temporaryMetadata = `${paths.metadata}.${nonce}.tmp`
      let publishedAudio = false

      await mkdir(root, { recursive: true })

      try {
        await writeFile(temporaryAudio, entry.bytes, { flag: 'wx' })
        await writeFile(temporaryMetadata, JSON.stringify(metadata), { flag: 'wx' })
        await rename(temporaryAudio, paths.audio)
        publishedAudio = true
        await rename(temporaryMetadata, paths.metadata)
        await pruneAudioCache(root, maximumBytes).catch(() => undefined)
      } catch (error) {
        await Promise.allSettled([
          rm(temporaryAudio, { force: true }),
          rm(temporaryMetadata, { force: true }),
          ...(publishedAudio ? [rm(paths.audio, { force: true })] : []),
        ])
        throw error
      }
    },
  }
}
