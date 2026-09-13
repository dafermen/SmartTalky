const UNICODE_SEPARATOR_RUN = /\p{Z}+/gu
const LEADING_OR_TRAILING_UNICODE_SEPARATORS = /^\p{Z}+|\p{Z}+$/gu

/**
 * Produce una representación estable sin cambiar mayúsculas, puntuación o controles.
 * Los controles se conservan deliberadamente para que la validación pueda rechazarlos.
 */
export function normalizePronunciationText(text: string): string {
  return text
    .normalize('NFC')
    .replace(LEADING_OR_TRAILING_UNICODE_SEPARATORS, '')
    .replace(UNICODE_SEPARATOR_RUN, ' ')
}
