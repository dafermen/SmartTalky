import type { PronunciationMode } from '@smarttalky/types'

export const SPEECH_INSTRUCTIONS_VERSION = 'speech-instructions-v1'

export interface SpeechModeProfile {
  instructions: string
  instructionsVersion: string
  speed: number
}

/**
 * Configuración pedagógica que también formará parte de la identidad de caché.
 * La velocidad ya invalida su propia caché; cambiar instrucciones exige una versión nueva.
 */
export const SPEECH_MODE_PROFILES: Readonly<
  Record<PronunciationMode, Readonly<SpeechModeProfile>>
> = Object.freeze({
  natural: Object.freeze({
    instructions:
      'Speak the exact input once in clear, natural General American English. Preserve every word and punctuation cue. Do not add explanations or other words.',
    instructionsVersion: SPEECH_INSTRUCTIONS_VERSION,
    speed: 1,
  }),
  slow: Object.freeze({
    instructions:
      'Speak the exact input once in clear General American English at a deliberately slow learning pace. Keep the pronunciation natural; do not spell letters or add explanations.',
    instructionsVersion: SPEECH_INSTRUCTIONS_VERSION,
    speed: 0.75,
  }),
  teacher: Object.freeze({
    instructions:
      'Speak the supplied learning sequence exactly once in clear General American English. Pause clearly between every period-separated item, keep pronunciation chunks separate, and do not add labels, explanations, or other words.',
    instructionsVersion: 'speech-instructions-teacher-v2',
    speed: 1,
  }),
})

export function getSpeechModeProfile(
  mode: PronunciationMode,
): Readonly<SpeechModeProfile> {
  return SPEECH_MODE_PROFILES[mode]
}
