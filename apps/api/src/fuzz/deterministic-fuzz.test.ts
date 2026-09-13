import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import {
  MAX_PRONUNCIATION_TEXT_LENGTH,
  normalizePronunciationText,
  pronunciationRequestSchema,
  pronunciationTextSchema,
} from '@smarttalky/shared'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  AUDIO_METADATA_SCHEMA_VERSION,
  type AudioCacheEntry,
} from '../features/text-to-speech/application/audio-cache-repository.js'
import {
  createAudioKey,
  type AudioIdentity,
} from '../features/text-to-speech/domain/audio-identity.js'
import { createLocalAudioCacheRepository } from '../features/text-to-speech/infrastructure/local-audio-cache-repository.js'

const FUZZ_SEED = 0x5eedc0de
const AUDIO_KEY_PATTERN = /^[a-f0-9]{64}$/
const TEXT_TOKENS = [
  'a',
  'Z',
  ' ',
  '\u00A0',
  '\u2003',
  '\t',
  '\n',
  '\u0000',
  '\u001F',
  '\u007F',
  '\u0085',
  '\u009F',
  '\u0301',
  'é',
  '👍',
  '中',
  "'",
  '-',
  '.',
  '\uD800',
  '\uDC00',
] as const
const JSON_TOKENS = ['{', '}', '[', ']', ':', ',', '"', '\\', '0', 'a', ' ', '\n']
const KEY_TOKENS = ['a', 'f', '0', '9', 'g', '/', '\\', '.', '-', '👍'] as const

function createGenerator(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return state >>> 0
  }
}

function containsControlCharacter(text: string): boolean {
  return Array.from(text).some((character) => {
    const codePoint = character.codePointAt(0)
    return (
      codePoint !== undefined &&
      (codePoint <= 0x1f || (codePoint >= 0x7f && codePoint <= 0x9f))
    )
  })
}

function createText(next: () => number, maximumTokens: number): string {
  const length = next() % (maximumTokens + 1)
  let result = ''

  for (let index = 0; index < length; index += 1) {
    result += TEXT_TOKENS[next() % TEXT_TOKENS.length]
  }

  return result
}

function createTokenString(
  next: () => number,
  tokens: readonly string[],
  maximumLength: number,
): string {
  const length = next() % (maximumLength + 1)
  let result = ''

  for (let index = 0; index < length; index += 1) {
    result += tokens[next() % tokens.length]
  }

  return result
}

describe('fuzzing determinista', () => {
  let cacheDirectory: string

  beforeAll(async () => {
    cacheDirectory = await mkdtemp(path.join(tmpdir(), 'smarttalky-fuzz-'))
  })

  afterAll(async () => {
    await rm(cacheDirectory, { recursive: true, force: true })
  })

  it('mantiene invariantes de normalización y validación con Unicode adversarial', () => {
    const next = createGenerator(FUZZ_SEED)

    for (let iteration = 0; iteration < 2_000; iteration += 1) {
      const input = createText(next, 150)
      const normalized = normalizePronunciationText(input)
      const parsed = pronunciationTextSchema.safeParse(input)

      expect(normalizePronunciationText(normalized)).toBe(normalized)
      expect(() =>
        pronunciationRequestSchema.safeParse({
          text: input,
          locale: 'en-US',
          modes: ['natural'],
        }),
      ).not.toThrow()

      if (parsed.success) {
        expect(parsed.data).toBe(normalized)
        expect(Array.from(parsed.data).length).toBeLessThanOrEqual(
          MAX_PRONUNCIATION_TEXT_LENGTH,
        )
        expect(containsControlCharacter(parsed.data)).toBe(false)
      }
    }
  })

  it('rechaza o procesa JSON aleatorio y profundo sin propagar excepciones', () => {
    const next = createGenerator(FUZZ_SEED ^ 0x4a534f4e)
    const candidates = Array.from({ length: 750 }, () =>
      createTokenString(next, JSON_TOKENS, 256),
    )
    candidates.push('['.repeat(256) + 'null' + ']'.repeat(256))

    for (const candidate of candidates) {
      let parsed: unknown

      try {
        parsed = JSON.parse(candidate)
      } catch {
        continue
      }

      expect(() => pronunciationRequestSchema.safeParse(parsed)).not.toThrow()
    }
  })

  it('impide que claves aleatorias salgan del directorio controlado', async () => {
    const next = createGenerator(FUZZ_SEED ^ 0x4b455953)
    const repository = createLocalAudioCacheRepository(cacheDirectory)

    for (let iteration = 0; iteration < 300; iteration += 1) {
      const key = createTokenString(next, KEY_TOKENS, 80)

      if (AUDIO_KEY_PATTERN.test(key)) {
        await expect(repository.findByKey(key)).resolves.toBeUndefined()
      } else {
        await expect(repository.findByKey(key)).rejects.toThrow(
          'La clave de caché de audio no es válida.',
        )
      }
    }
  })

  it('trata JSON truncado o aleatorio como cache miss', async () => {
    const next = createGenerator(FUZZ_SEED ^ 0x4d455441)
    const identity: AudioIdentity = {
      text: 'fuzz-cache',
      locale: 'en-US',
      voice: 'marin',
      mode: 'natural',
      speed: 1,
      model: 'fuzz-model',
      instructionsVersion: 'fuzz-v1',
    }
    const key = createAudioKey(identity)
    const audioPath = path.join(cacheDirectory, key + '.audio')
    const metadataPath = path.join(cacheDirectory, key + '.json')
    const validMetadata = JSON.stringify({
      schemaVersion: AUDIO_METADATA_SCHEMA_VERSION,
      key,
      identity,
      mimeType: 'audio/wav',
      byteLength: 4,
      createdAt: '2026-09-09T00:00:00.000Z',
      provider: 'fuzz',
    })

    await writeFile(audioPath, Uint8Array.from([82, 73, 70, 70]))

    for (let end = 0; end < validMetadata.length; end += 17) {
      await writeFile(metadataPath, validMetadata.slice(0, end))
      await expect(
        createLocalAudioCacheRepository(cacheDirectory).findByKey(key),
      ).resolves.toBeUndefined()
    }

    for (let iteration = 0; iteration < 100; iteration += 1) {
      await writeFile(metadataPath, createTokenString(next, JSON_TOKENS, 512))
      await expect(
        createLocalAudioCacheRepository(cacheDirectory).findByKey(key),
      ).resolves.toBeUndefined()
    }
  })

  it('rechaza metadatos generados que contradicen sus bytes o identidad', async () => {
    const next = createGenerator(FUZZ_SEED ^ 0x42595445)
    const repository = createLocalAudioCacheRepository(cacheDirectory)

    for (let iteration = 0; iteration < 100; iteration += 1) {
      const bytes = Uint8Array.from({ length: next() % 16 }, () => next() % 256)
      const identity: AudioIdentity = {
        text: createText(next, 12),
        locale: 'en-US',
        voice: 'marin',
        mode: 'natural',
        speed: 1,
        model: 'fuzz-model',
        instructionsVersion: 'fuzz-v1',
      }
      const entry = {
        bytes,
        metadata: {
          schemaVersion: AUDIO_METADATA_SCHEMA_VERSION,
          key: createAudioKey(identity),
          identity,
          mimeType: iteration % 2 === 0 ? 'audio/ogg' : 'audio/wav',
          byteLength: bytes.byteLength + 1,
          createdAt: 'not-a-date',
          provider: '',
        },
      } as unknown as AudioCacheEntry

      await expect(repository.save(entry)).rejects.toThrow()
    }
  })
})
