import { PRONUNCIATION_MODES } from '@smarttalky/types'
import { describe, expect, it } from 'vitest'

import {
  getSpeechModeProfile,
  SPEECH_INSTRUCTIONS_VERSION,
  SPEECH_MODE_PROFILES,
} from './speech-mode-profile.js'

describe('perfiles pedagógicos TTS', () => {
  it('mantiene una versión explícita para invalidar cambios incompatibles', () => {
    expect(SPEECH_INSTRUCTIONS_VERSION).toBe('speech-instructions-v1')
  })

  it('cubre exactamente todas las modalidades públicas', () => {
    expect(Object.keys(SPEECH_MODE_PROFILES).sort()).toEqual(
      [...PRONUNCIATION_MODES].sort(),
    )
  })

  it('fija las instrucciones y velocidades educativas', () => {
    expect(SPEECH_MODE_PROFILES).toMatchInlineSnapshot(`
      {
        "natural": {
          "instructions": "Speak the exact input once in clear, natural General American English. Preserve every word and punctuation cue. Do not add explanations or other words.",
          "instructionsVersion": "speech-instructions-v1",
          "speed": 1,
        },
        "slow": {
          "instructions": "Speak the exact input once in clear General American English at a deliberately slow learning pace. Keep the pronunciation natural; do not spell letters or add explanations.",
          "instructionsVersion": "speech-instructions-v1",
          "speed": 0.75,
        },
        "teacher": {
          "instructions": "Speak the supplied learning sequence exactly once in clear General American English. Pause clearly between every period-separated item, keep pronunciation chunks separate, and do not add labels, explanations, or other words.",
          "instructionsVersion": "speech-instructions-teacher-v2",
          "speed": 1,
        },
      }
    `)
  })

  it('expone perfiles congelados para evitar mutaciones accidentales', () => {
    expect(Object.isFrozen(SPEECH_MODE_PROFILES)).toBe(true)

    for (const mode of PRONUNCIATION_MODES) {
      expect(Object.isFrozen(getSpeechModeProfile(mode))).toBe(true)
    }
  })
})
