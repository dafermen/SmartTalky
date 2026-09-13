import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  AUDIO_METADATA_SCHEMA_VERSION,
  type AudioCacheEntry,
} from '../application/audio-cache-repository.js'
import { createAudioKey, type AudioIdentity } from '../domain/audio-identity.js'
import { createLocalAudioCacheRepository } from './local-audio-cache-repository.js'

const identity: AudioIdentity = {
  text: 'comfortable',
  locale: 'en-US',
  voice: 'marin',
  mode: 'natural',
  speed: 1,
  model: 'gpt-4o-mini-tts-2025-12-15',
  instructionsVersion: 'speech-instructions-v1',
}

function createEntry(text = identity.text): AudioCacheEntry {
  const bytes = Uint8Array.from([82, 73, 70, 70])
  const entryIdentity = { ...identity, text }
  return {
    bytes,
    metadata: {
      schemaVersion: AUDIO_METADATA_SCHEMA_VERSION,
      key: createAudioKey(entryIdentity),
      identity: entryIdentity,
      mimeType: 'audio/wav',
      byteLength: bytes.byteLength,
      createdAt: '2026-07-18T12:00:00.000Z',
      provider: 'openai',
    },
  }
}

describe('repositorio local de caché de audio', () => {
  let directory: string

  beforeEach(async () => {
    directory = await mkdtemp(path.join(tmpdir(), 'smarttalky-cache-'))
  })

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true })
  })

  it('persiste y recupera bytes con metadatos válidos', async () => {
    const repository = createLocalAudioCacheRepository(directory)
    const entry = createEntry()

    await repository.save(entry)

    await expect(repository.findByKey(entry.metadata.key)).resolves.toEqual(entry)
    expect(await readdir(directory)).toEqual([
      `${entry.metadata.key}.audio`,
      `${entry.metadata.key}.json`,
    ])
  })

  it('trata una entrada ausente o corrupta como fallo de caché', async () => {
    const repository = createLocalAudioCacheRepository(directory)
    const entry = createEntry()

    await expect(repository.findByKey(entry.metadata.key)).resolves.toBeUndefined()
    await repository.save(entry)
    await writeFile(
      path.join(directory, `${entry.metadata.key}.json`),
      '{"schemaVersion":"desconocida"}',
    )

    await expect(repository.findByKey(entry.metadata.key)).resolves.toBeUndefined()
  })

  it('rechaza traversal y claves que no sean SHA-256', async () => {
    const repository = createLocalAudioCacheRepository(directory)

    await expect(repository.findByKey('../secreto')).rejects.toThrow('clave')
    await expect(repository.findByKey('a'.repeat(63))).rejects.toThrow('clave')
  })

  it('rechaza metadatos que no coinciden con bytes o identidad', async () => {
    const repository = createLocalAudioCacheRepository(directory)
    const entry = createEntry()

    await expect(
      repository.save({
        ...entry,
        metadata: { ...entry.metadata, byteLength: 99 },
      }),
    ).rejects.toThrow('consistente')
    await expect(
      repository.save({
        ...entry,
        metadata: { ...entry.metadata, key: 'a'.repeat(64) },
      }),
    ).rejects.toThrow('consistente')
    expect(await readdir(directory)).toEqual([])
  })

  it('guarda JSON sin incorporar una ruta ni autorización', async () => {
    const repository = createLocalAudioCacheRepository(directory)
    const entry = createEntry()
    await repository.save(entry)

    const metadata = await readFile(
      path.join(directory, `${entry.metadata.key}.json`),
      'utf8',
    )

    expect(metadata).not.toContain('Authorization')
    expect(metadata).not.toContain('OPENAI_API_KEY')
    expect(metadata).not.toContain(directory)
  })

  it('limpia temporales y audio publicado si falla el último rename', async () => {
    const repository = createLocalAudioCacheRepository(directory)
    const entry = createEntry()
    const metadataPath = path.join(directory, `${entry.metadata.key}.json`)
    await mkdir(metadataPath)

    await expect(repository.save(entry)).rejects.toThrow()

    const names = await readdir(directory)
    expect(names).toEqual([`${entry.metadata.key}.json`])
    expect(names.some((name) => name.endsWith('.tmp'))).toBe(false)
    await expect(repository.findByKey(entry.metadata.key)).resolves.toBeUndefined()
  })

  it('retira primero la entrada menos reciente al superar el tope', async () => {
    const repository = createLocalAudioCacheRepository(directory, {
      maximumBytes: 500,
    })
    const first = createEntry('first')
    const second = createEntry('second')

    await repository.save(first)
    await new Promise((resolve) => setTimeout(resolve, 10))
    await repository.save(second)

    await expect(repository.findByKey(first.metadata.key)).resolves.toBeUndefined()
    await expect(repository.findByKey(second.metadata.key)).resolves.toEqual(second)
  })
})
