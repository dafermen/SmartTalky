import { PRONUNCIATION_MODES } from '@smarttalky/types'
import type {
  PronunciationAudio,
  PronunciationEntry,
  PronunciationRequest,
  PronunciationResponse,
  PronunciationSyllable,
} from '@smarttalky/types'
import { z } from 'zod'

import { pronunciationTextSchema } from './pronunciation-text.js'

export const pronunciationModeSchema = z.enum(PRONUNCIATION_MODES)
export const pronunciationTextKindSchema = z.enum(['word', 'phrase'])

export const pronunciationSyllableSchema: z.ZodType<PronunciationSyllable> =
  z.strictObject({
    text: z.string().min(1),
    stressed: z.boolean(),
  })

export const pronunciationEntrySchema: z.ZodType<PronunciationEntry> = z.strictObject({
  text: pronunciationTextSchema,
  kind: pronunciationTextKindSchema,
  locale: z.literal('en-US'),
  ipa: z.string().min(1).optional(),
  syllables: z.array(pronunciationSyllableSchema).optional(),
  translation: z.string().min(1).optional(),
  example: z.string().min(1).optional(),
  exampleTranslation: z.string().min(1).optional(),
})

export const pronunciationAudioSchema: z.ZodType<PronunciationAudio> = z.strictObject({
  key: z.string().min(1),
  mode: pronunciationModeSchema,
  mimeType: z.enum(['audio/mpeg', 'audio/wav']),
  byteLength: z.number().int().nonnegative(),
  durationMs: z.number().int().positive().optional(),
})

export const pronunciationRequestSchema: z.ZodType<PronunciationRequest> = z.strictObject(
  {
    text: pronunciationTextSchema,
    locale: z.literal('en-US'),
    modes: z.array(pronunciationModeSchema).min(1).max(PRONUNCIATION_MODES.length),
  },
)

export const pronunciationResponseSchema: z.ZodType<PronunciationResponse> =
  z.strictObject({
    pronunciation: pronunciationEntrySchema,
    audio: z.array(pronunciationAudioSchema),
  })
