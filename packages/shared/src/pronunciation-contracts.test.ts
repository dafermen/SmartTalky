import type { PronunciationRequest, PronunciationResponse } from '@smarttalky/types'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { pronunciationRequestSchema, pronunciationResponseSchema } from './index.js'

const validRequest = {
  text: 'comfortable',
  locale: 'en-US',
  modes: ['natural', 'slow', 'teacher'],
} as const

const validResponse = {
  pronunciation: {
    text: 'comfortable',
    kind: 'word',
    locale: 'en-US',
    ipa: '/ˈkʌm.fɚ.t̬ə.bəl/',
    syllables: [
      { text: 'com', stressed: true },
      { text: 'fort', stressed: false },
    ],
    translation: 'cómodo o cómoda',
    example: 'These shoes are very comfortable.',
  },
  audio: [
    {
      key: 'opaque-natural-key',
      mode: 'natural',
      mimeType: 'audio/mpeg',
      byteLength: 2048,
      durationMs: 900,
    },
  ],
} as const

describe('contratos de pronunciación', () => {
  it('acepta una solicitud válida y conserva su tipo compartido', () => {
    const parsed = pronunciationRequestSchema.parse(validRequest)

    expect(parsed).toEqual(validRequest)
    expectTypeOf(parsed).toMatchTypeOf<PronunciationRequest>()
  })

  it.each([
    { ...validRequest, locale: 'en-GB' },
    { ...validRequest, modes: [] },
    { ...validRequest, modes: ['fast'] },
    { ...validRequest, unexpected: true },
  ])('rechaza una solicitud inválida', (request) => {
    expect(pronunciationRequestSchema.safeParse(request).success).toBe(false)
  })

  it('acepta una respuesta completa y conserva su tipo compartido', () => {
    const parsed = pronunciationResponseSchema.parse(validResponse)

    expect(parsed).toEqual(validResponse)
    expectTypeOf(parsed).toMatchTypeOf<PronunciationResponse>()
  })

  it('acepta las variantes válidas que definen los extremos del contrato', () => {
    const phraseRequest = {
      ...validRequest,
      text: 'Good morning',
      modes: ['slow'],
    } as const
    const responseWithAlternatives = {
      pronunciation: {
        ...validResponse.pronunciation,
        kind: 'phrase',
        exampleTranslation: 'Estos zapatos son muy cómodos.',
      },
      audio: [
        {
          ...validResponse.audio[0],
          mimeType: 'audio/wav',
          byteLength: 0,
          durationMs: undefined,
        },
      ],
    } as const

    expect(pronunciationRequestSchema.parse(phraseRequest)).toEqual(phraseRequest)
    expect(pronunciationResponseSchema.parse(responseWithAlternatives)).toEqual(
      responseWithAlternatives,
    )
  })

  it.each([
    {
      ...validResponse,
      audio: [{ ...validResponse.audio[0], mimeType: 'audio/ogg' }],
    },
    {
      ...validResponse,
      audio: [{ ...validResponse.audio[0], byteLength: -1 }],
    },
    {
      ...validResponse,
      pronunciation: { ...validResponse.pronunciation, kind: 'sentence' },
    },
    {
      ...validResponse,
      pronunciation: { ...validResponse.pronunciation, kind: '' },
    },
    {
      ...validResponse,
      pronunciation: {
        ...validResponse.pronunciation,
        exampleTranslation: '',
      },
    },
    {
      ...validResponse,
      audio: [{ ...validResponse.audio[0], mimeType: '' }],
    },
    { ...validResponse, unexpected: true },
  ])('rechaza una respuesta inválida', (response) => {
    expect(pronunciationResponseSchema.safeParse(response).success).toBe(false)
  })
})
