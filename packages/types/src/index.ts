/** Idiomas que participan en la experiencia educativa de SmartTalky. */
export interface LanguageSettings {
  interfaceLanguage: 'es'
  nativeLanguage: 'es'
  learningLanguage: 'en'
  pronunciationLocale: 'en-US'
}

/** Modalidades de audio admitidas por el MVP. */
export const PRONUNCIATION_MODES = ['natural', 'slow', 'teacher'] as const

export type PronunciationMode = (typeof PRONUNCIATION_MODES)[number]

/** Distingue una palabra de una frase sin inferir categorías lingüísticas adicionales. */
export type PronunciationTextKind = 'word' | 'phrase'

export interface PronunciationSyllable {
  text: string
  stressed: boolean
}

/** Contenido educativo independiente del proveedor que lo produzca. */
export interface PronunciationEntry {
  text: string
  kind: PronunciationTextKind
  locale: 'en-US'
  ipa?: string | undefined
  syllables?: readonly PronunciationSyllable[] | undefined
  translation?: string | undefined
  example?: string | undefined
  exampleTranslation?: string | undefined
}

/** Metadatos seguros de un audio; la clave opaca nunca es una ruta de archivo. */
export interface PronunciationAudio {
  key: string
  mode: PronunciationMode
  mimeType: 'audio/mpeg' | 'audio/wav'
  byteLength: number
  durationMs?: number | undefined
}

export interface PronunciationRequest {
  text: string
  locale: 'en-US'
  modes: readonly PronunciationMode[]
}

export interface PronunciationResponse {
  pronunciation: PronunciationEntry
  audio: readonly PronunciationAudio[]
}
