import type { PronunciationResponse } from '@smarttalky/types'
import { describe, expect, it, vi } from 'vitest'

import type { GetOrCreateSpeech } from '../../text-to-speech/application/get-or-create-speech.js'
import type { PronunciationProvider } from '../application/get-pronunciation.js'
import { createCachingPronunciationProvider } from './caching-pronunciation-provider.js'

describe('proveedor de pronunciación con caché', () => {
  it('conserva datos educativos y genera cada modalidad solicitada', async () => {
    const educationalResult: PronunciationResponse = {
      pronunciation: {
        text: 'hello',
        kind: 'word',
        locale: 'en-US',
        translation: 'hola',
      },
      audio: [],
    }
    const educationalProvider: PronunciationProvider = {
      lookup: vi.fn().mockResolvedValue(educationalResult),
    }
    const getOrCreate = vi
      .fn<GetOrCreateSpeech>()
      .mockImplementation(async (request) => ({
        cacheStatus: 'miss',
        entry: {
          bytes: Uint8Array.from([1]),
          metadata: {
            schemaVersion: 'audio-metadata-v1',
            key: request.mode.padEnd(64, 'a'),
            identity: {
              text: request.text,
              locale: request.locale,
              voice: 'marin',
              mode: request.mode,
              speed: 1,
              model: 'model',
              instructionsVersion: 'v1',
            },
            mimeType: 'audio/wav',
            byteLength: 1,
            createdAt: '2026-07-18T12:00:00.000Z',
            provider: 'fake',
          },
        },
      }))
    const provider = createCachingPronunciationProvider(educationalProvider, getOrCreate)

    const result = await provider.lookup({
      text: 'hello',
      locale: 'en-US',
      modes: ['natural', 'slow'],
    })

    expect(educationalProvider.lookup).toHaveBeenCalledWith({
      text: 'hello',
      locale: 'en-US',
      modes: [],
    })
    expect(getOrCreate).toHaveBeenCalledTimes(2)
    expect(result.pronunciation.translation).toBe('hola')
    expect(result.audio.map(({ mode }) => mode)).toEqual(['natural', 'slow'])
  })

  it('construye Profesor como palabra, sílabas separadas y palabra', async () => {
    const educationalProvider: PronunciationProvider = {
      lookup: vi.fn().mockResolvedValue({
        pronunciation: {
          text: 'hello',
          kind: 'word',
          locale: 'en-US',
          syllables: [
            { text: 'hel', stressed: false },
            { text: 'lo', stressed: true },
          ],
        },
        audio: [],
      }),
    }
    const getOrCreate = vi.fn<GetOrCreateSpeech>().mockResolvedValue({
      cacheStatus: 'miss',
      entry: {
        bytes: Uint8Array.from([1]),
        metadata: {
          schemaVersion: 'audio-metadata-v1',
          key: 'a'.repeat(64),
          identity: {
            text: 'hello. hel. lo. hello.',
            locale: 'en-US',
            voice: 'marin',
            mode: 'teacher',
            speed: 1,
            model: 'model',
            instructionsVersion: 'speech-instructions-teacher-v2',
          },
          mimeType: 'audio/wav',
          byteLength: 1,
          createdAt: '2026-07-25T12:00:00.000Z',
          provider: 'fake',
        },
      },
    })

    await createCachingPronunciationProvider(educationalProvider, getOrCreate).lookup({
      text: 'hello',
      locale: 'en-US',
      modes: ['teacher'],
    })

    expect(getOrCreate).toHaveBeenCalledWith({
      text: 'hello. hel. lo. hello.',
      locale: 'en-US',
      mode: 'teacher',
    })
  })
})
