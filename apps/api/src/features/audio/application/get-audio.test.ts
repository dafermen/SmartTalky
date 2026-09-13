import { describe, expect, it } from 'vitest'

import { AudioNotFoundError } from '../../../domain/errors/app-error.js'
import {
  createGetAudio,
  MAX_AUDIO_BYTE_LENGTH,
  type AudioRepository,
} from './get-audio.js'

function repositoryReturning(
  value: Awaited<ReturnType<AudioRepository['findByKey']>>,
): AudioRepository {
  return {
    async findByKey() {
      return value
    },
  }
}

describe('createGetAudio', () => {
  it('devuelve un activo permitido', async () => {
    const asset = { bytes: Uint8Array.from([1, 2, 3]), mimeType: 'audio/mpeg' as const }

    await expect(createGetAudio(repositoryReturning(asset))('safe-key')).resolves.toBe(
      asset,
    )
  })

  it('traduce una clave ausente a un error 404 seguro', async () => {
    await expect(
      createGetAudio(repositoryReturning(undefined))('missing'),
    ).rejects.toBeInstanceOf(AudioNotFoundError)
  })

  it.each([0, MAX_AUDIO_BYTE_LENGTH + 1])('rechaza tamaños inseguros', async (size) => {
    const asset = { bytes: new Uint8Array(size), mimeType: 'audio/wav' as const }

    await expect(createGetAudio(repositoryReturning(asset))('unsafe')).rejects.toThrow(
      'activo de audio inválido',
    )
  })
})
