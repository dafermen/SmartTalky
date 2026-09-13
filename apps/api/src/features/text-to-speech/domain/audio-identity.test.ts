import { describe, expect, it } from 'vitest'

import {
  createAudioKey,
  serializeAudioIdentity,
  type AudioIdentity,
} from './audio-identity.js'

const identity: AudioIdentity = {
  text: 'Comfortable',
  locale: 'en-US',
  voice: 'marin',
  mode: 'natural',
  speed: 1,
  model: 'gpt-4o-mini-tts-2025-12-15',
  instructionsVersion: 'speech-instructions-v1',
}

describe('identidad de audio', () => {
  it('mantiene una serialización canónica explícita', () => {
    expect(serializeAudioIdentity(identity)).toBe(
      '{"schemaVersion":"audio-identity-v1","text":"Comfortable","locale":"en-US","voice":"marin","mode":"natural","speed":1,"model":"gpt-4o-mini-tts-2025-12-15","instructionsVersion":"speech-instructions-v1"}',
    )
  })

  it('mantiene un vector SHA-256 estable y opaco', () => {
    const key = createAudioKey(identity)

    expect(key).toBe('a691b76d22be9aa5a24b25178a6eb6ef77463c11689094b66f75f435d1100453')
    expect(key).toMatch(/^[a-f0-9]{64}$/)
    expect(key).not.toContain('comfortable')
  })

  it.each<[keyof AudioIdentity, AudioIdentity[keyof AudioIdentity]]>([
    ['text', 'comfortable'],
    ['locale', 'en-GB'],
    ['voice', 'cedar'],
    ['mode', 'slow'],
    ['speed', 0.75],
    ['model', 'tts-1'],
    ['instructionsVersion', 'speech-instructions-v2'],
  ])('cambia la clave cuando cambia %s', (field, value) => {
    expect(createAudioKey({ ...identity, [field]: value })).not.toBe(
      createAudioKey(identity),
    )
  })

  it('rechaza velocidades que no pueden serializarse con seguridad', () => {
    expect(() => createAudioKey({ ...identity, speed: Number.NaN })).toThrow('velocidad')
    expect(() => createAudioKey({ ...identity, speed: 0 })).toThrow('velocidad')
  })
})
