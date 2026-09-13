import { describe, expect, it } from 'vitest'

import { normalizePronunciationText } from './normalize-pronunciation-text.js'

describe('normalizePronunciationText', () => {
  it.each([
    ['  Good   morning  ', 'Good morning'],
    ['\u00A0hello\u2003world\u00A0', 'hello world'],
    ['cafe\u0301', 'café'],
    ["Don't change punctuation!", "Don't change punctuation!"],
    ['', ''],
    ['\u00A0\u2003', ''],
  ])('normaliza separadores y Unicode de forma estable', (input, expected) => {
    expect(normalizePronunciationText(input)).toBe(expected)
    expect(normalizePronunciationText(normalizePronunciationText(input))).toBe(expected)
  })

  it('conserva mayúsculas porque pueden aportar significado', () => {
    expect(normalizePronunciationText('US us')).toBe('US us')
  })

  it.each(['hello\tworld', 'hello\nworld', 'hello\u0000world'])(
    'conserva controles para que la validación posterior los rechace',
    (input) => {
      expect(normalizePronunciationText(input)).toBe(input)
    },
  )
})
