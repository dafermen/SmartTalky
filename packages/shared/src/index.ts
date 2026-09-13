import type { LanguageSettings } from '@smarttalky/types'

/** Configuración lingüística inicial y única del MVP. */
export const DEFAULT_LANGUAGE_SETTINGS: LanguageSettings = {
  interfaceLanguage: 'es',
  nativeLanguage: 'es',
  learningLanguage: 'en',
  pronunciationLocale: 'en-US',
}

export type { LanguageSettings } from '@smarttalky/types'

export {
  pronunciationAudioSchema,
  pronunciationEntrySchema,
  pronunciationModeSchema,
  pronunciationRequestSchema,
  pronunciationResponseSchema,
  pronunciationSyllableSchema,
  pronunciationTextKindSchema,
} from './pronunciation-contracts.js'

export { normalizePronunciationText } from './normalize-pronunciation-text.js'
export {
  createPronunciationTextSchema,
  MAX_PRONUNCIATION_TEXT_LENGTH,
  pronunciationTextSchema,
  type PronunciationTextMessages,
} from './pronunciation-text.js'
