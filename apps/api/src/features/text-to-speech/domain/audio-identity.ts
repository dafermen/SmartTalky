import { createHash } from 'node:crypto'

import type { PronunciationMode } from '@smarttalky/types'

export const AUDIO_IDENTITY_SCHEMA_VERSION = 'audio-identity-v1'

export interface AudioIdentity {
  text: string
  locale: string
  voice: string
  mode: PronunciationMode
  speed: number
  model: string
  instructionsVersion: string
}

/** Selecciona un orden fijo; el orden de propiedades recibido nunca altera la clave. */
export function serializeAudioIdentity(identity: AudioIdentity): string {
  if (!Number.isFinite(identity.speed) || identity.speed <= 0) {
    throw new Error('La velocidad de la identidad de audio no es válida.')
  }

  return JSON.stringify({
    schemaVersion: AUDIO_IDENTITY_SCHEMA_VERSION,
    text: identity.text,
    locale: identity.locale,
    voice: identity.voice,
    mode: identity.mode,
    speed: identity.speed,
    model: identity.model,
    instructionsVersion: identity.instructionsVersion,
  })
}

/** Produce una clave opaca SHA-256; el texto del usuario nunca se usa como ruta. */
export function createAudioKey(identity: AudioIdentity): string {
  return createHash('sha256')
    .update(serializeAudioIdentity(identity), 'utf8')
    .digest('hex')
}
