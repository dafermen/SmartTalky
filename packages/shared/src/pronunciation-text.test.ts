import { describe, expect, it } from 'vitest'

import {
  MAX_PRONUNCIATION_TEXT_LENGTH,
  pronunciationRequestSchema,
  pronunciationTextSchema,
} from './index.js'
import { createPronunciationTextSchema } from './pronunciation-text.js'

describe('pronunciationTextSchema', () => {
  it('acepta exactamente el máximo de puntos de código', () => {
    const text = 'a'.repeat(MAX_PRONUNCIATION_TEXT_LENGTH)

    expect(pronunciationTextSchema.parse(text)).toBe(text)
  })

  it('rechaza un carácter por encima del máximo', () => {
    const text = 'a'.repeat(MAX_PRONUNCIATION_TEXT_LENGTH + 1)

    expect(pronunciationTextSchema.safeParse(text).success).toBe(false)
  })

  it('cuenta un emoji como un punto de código y normaliza antes de medir', () => {
    const schema = createPronunciationTextSchema(2)

    expect(schema.parse('👍a')).toBe('👍a')
    expect(schema.parse('e\u0301a')).toBe('éa')
    expect(schema.safeParse('👍ab').success).toBe(false)
  })

  it.each(['', '   ', '\u00A0\u2003'])(
    'rechaza entradas vacías tras normalizar',
    (text) => {
      expect(pronunciationTextSchema.safeParse(text).success).toBe(false)
    },
  )

  it.each([
    'hello\u0000world',
    'hello\u001Fworld',
    'hello\tworld',
    'hello\nworld',
    'hello\u007Fworld',
    'hello\u0085world',
    'hello\u009Fworld',
  ])('rechaza controles C0, DEL y C1', (text) => {
    expect(pronunciationTextSchema.safeParse(text).success).toBe(false)
  })

  it('acepta los puntos de código adyacentes a los rangos de control', () => {
    expect(pronunciationTextSchema.parse('hello world')).toBe('hello world')
    expect(pronunciationTextSchema.parse('hello\u00A0world')).toBe('hello world')
  })

  it('normaliza el texto dentro de una solicitud completa', () => {
    const parsed = pronunciationRequestSchema.parse({
      text: '\u00A0Good\u2003morning\u00A0',
      locale: 'en-US',
      modes: ['natural'],
    })

    expect(parsed.text).toBe('Good morning')
  })

  it.each([0, -1, 1.5, Number.NaN])(
    'rechaza una configuración máxima inválida',
    (maximum) => {
      expect(() => createPronunciationTextSchema(maximum)).toThrow(
        new RangeError('El máximo de caracteres debe ser un entero positivo.'),
      )
    },
  )

  it('acepta el mínimo configurable de un carácter', () => {
    const schema = createPronunciationTextSchema(1)

    expect(schema.parse('a')).toBe('a')
    expect(schema.safeParse('ab').success).toBe(false)
  })

  it('expone los mensajes predeterminados de cada regla', () => {
    const tooLong = pronunciationTextSchema.safeParse(
      'a'.repeat(MAX_PRONUNCIATION_TEXT_LENGTH + 1),
    )
    const control = pronunciationTextSchema.safeParse('hello\nworld')
    const required = pronunciationTextSchema.safeParse('   ')

    expect(required.error?.issues[0]?.message).toBe('Escribe una palabra o frase.')
    expect(tooLong.error?.issues[0]?.message).toBe(
      `Usa como máximo ${MAX_PRONUNCIATION_TEXT_LENGTH} caracteres.`,
    )
    expect(control.error?.issues[0]?.message).toBe(
      'El texto contiene caracteres de control no permitidos.',
    )
  })

  it('respeta mensajes personalizados sin sustituirlos por los predeterminados', () => {
    const schema = createPronunciationTextSchema(2, {
      required: 'required-message',
      maxLength: 'maximum-message',
      controlCharacters: 'control-message',
    })

    expect(schema.safeParse('').error?.issues[0]?.message).toBe('required-message')
    expect(schema.safeParse('abc').error?.issues[0]?.message).toBe('maximum-message')
    expect(schema.safeParse('a\n').error?.issues[0]?.message).toBe('control-message')
  })
})
