import { z } from 'zod'

import { normalizePronunciationText } from './normalize-pronunciation-text.js'

export const MAX_PRONUNCIATION_TEXT_LENGTH = 120

export interface PronunciationTextMessages {
  required: string
  maxLength: string
  controlCharacters: string
}

function containsControlCharacter(text: string): boolean {
  for (const character of text) {
    const codePoint = character.codePointAt(0)

    if (
      codePoint !== undefined &&
      (codePoint <= 0x1f || (codePoint >= 0x7f && codePoint <= 0x9f))
    ) {
      return true
    }
  }

  return false
}

/** Crea la regla de entrada compartida; el máximo puede reducirse por configuración futura. */
export function createPronunciationTextSchema(
  maxLength = MAX_PRONUNCIATION_TEXT_LENGTH,
  messages?: PronunciationTextMessages,
) {
  if (!Number.isSafeInteger(maxLength) || maxLength < 1) {
    throw new RangeError('El máximo de caracteres debe ser un entero positivo.')
  }

  const resolvedMessages = messages ?? {
    required: 'Escribe una palabra o frase.',
    maxLength: `Usa como máximo ${maxLength} caracteres.`,
    controlCharacters: 'El texto contiene caracteres de control no permitidos.',
  }

  return z
    .string()
    .transform(normalizePronunciationText)
    .pipe(
      z
        .string()
        .min(1, resolvedMessages.required)
        .refine((text) => Array.from(text).length <= maxLength, {
          message: resolvedMessages.maxLength,
        })
        .refine((text) => !containsControlCharacter(text), {
          message: resolvedMessages.controlCharacters,
        }),
    )
}

export const pronunciationTextSchema = createPronunciationTextSchema()
