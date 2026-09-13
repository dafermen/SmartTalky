import { pronunciationTextSchema } from '@smarttalky/shared'
import { z } from 'zod'
import { describe, expect, it } from 'vitest'

import corpusJson from './linguistic-quality-corpus.json' with { type: 'json' }

const corpusCaseSchema = z.strictObject({
  text: pronunciationTextSchema,
  kind: z.enum(['word', 'phrase']),
  tags: z.array(z.string().min(1)).min(1),
  minSegments: z.number().int().min(1).max(40),
})

const corpus = z.array(corpusCaseSchema).min(50).max(100).parse(corpusJson)

describe('corpus de calidad lingüística', () => {
  it('contiene entre 50 y 100 entradas únicas y válidas', () => {
    expect(new Set(corpus.map(({ text }) => text.toLocaleLowerCase('en-US'))).size).toBe(
      corpus.length,
    )
  })

  it('clasifica palabras y frases de forma coherente con el contrato', () => {
    for (const item of corpus) {
      expect(item.kind).toBe(item.text.includes(' ') ? 'phrase' : 'word')
    }
  })

  it('cubre riesgos fonéticos y situaciones cotidianas', () => {
    const tags = new Set(corpus.flatMap(({ tags: itemTags }) => itemTags))
    for (const requiredTag of [
      'stress',
      'reduction',
      'th',
      'flap-t',
      'r-colored',
      'cluster',
      'linking',
      'question',
      'travel',
      'polite',
    ]) {
      expect(tags.has(requiredTag), `Falta la cobertura ${requiredTag}`).toBe(true)
    }
  })
})
