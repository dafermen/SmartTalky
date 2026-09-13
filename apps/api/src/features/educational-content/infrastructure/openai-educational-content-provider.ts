import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import type { PronunciationEntry } from '@smarttalky/types'
import { z } from 'zod'

import type { PronunciationProvider } from '../../pronunciation/application/get-pronunciation.js'

export const DEFAULT_OPENAI_EDUCATIONAL_MODEL = 'gpt-5.6'
export const EDUCATIONAL_PROMPT_VERSION = 'educational-content-v1'

export const educationalOutputSchema = z.strictObject({
  ipa: z.string().trim().min(3).max(240),
  segments: z
    .array(
      z.strictObject({
        text: z.string().trim().min(1).max(40),
        stressed: z.boolean(),
      }),
    )
    .min(1)
    .max(40)
    .refine((segments) => segments.some(({ stressed }) => stressed), {
      message: 'Debe existir al menos un segmento acentuado.',
    }),
  translation: z.string().trim().min(1).max(240),
  example: z.string().trim().min(1).max(320),
  exampleTranslation: z.string().trim().min(1).max(320),
})

export type EducationalOutput = z.infer<typeof educationalOutputSchema>

interface GenerateEducationalContentRequest {
  text: string
  model: string
  instructions: string
  timeoutMs: number
}

export interface OpenAiEducationalClient {
  generate(request: GenerateEducationalContentRequest): Promise<unknown>
}

interface OpenAiEducationalProviderOptions {
  apiKey?: string | undefined
  client?: OpenAiEducationalClient | undefined
  model?: string | undefined
  timeoutMs?: number | undefined
}

const instructions = `
Eres un lingüista y profesor de pronunciación de inglés estadounidense para
estudiantes hispanohablantes. Analiza exclusivamente el texto entregado.

Devuelve:
- IPA de pronunciación General American entre barras.
- Para una palabra, sus sílabas ortográficas en orden.
- Para una frase, segmentos breves y pronunciables que cubran toda la frase.
- Marca stressed=true en el segmento con acento principal; puede haber más de
  uno en una frase, pero nunca cero.
- Traducción breve y natural al español.
- Un ejemplo cotidiano en inglés que use el texto sin modificar su intención.
- Traducción natural de ese ejemplo al español.

No agregues explicaciones, alternativas, Markdown ni contenido fuera del
esquema. Conserva nombres propios. Si el texto es ambiguo, usa el significado
más común en conversación y evita afirmaciones especializadas.
`.trim()

function createSdkClient(apiKey: string): OpenAiEducationalClient {
  const client = new OpenAI({ apiKey, maxRetries: 0 })

  return {
    async generate(request) {
      const response = await client.responses.parse(
        {
          model: request.model,
          reasoning: { effort: 'low' },
          instructions: request.instructions,
          input: request.text,
          text: {
            format: zodTextFormat(educationalOutputSchema, 'pronunciation_guide'),
          },
        },
        { signal: AbortSignal.timeout(request.timeoutMs) },
      )

      return response.output_parsed
    },
  }
}

/** Genera únicamente metadatos educativos; audio, HTTP y caché viven fuera. */
export function createOpenAiEducationalContentProvider(
  options: OpenAiEducationalProviderOptions = {},
): PronunciationProvider {
  const apiKey = options.apiKey?.trim()
  const client =
    options.client ??
    (apiKey === undefined || apiKey === '' ? undefined : createSdkClient(apiKey))
  const model = options.model ?? DEFAULT_OPENAI_EDUCATIONAL_MODEL
  const timeoutMs = options.timeoutMs ?? 20_000

  return {
    async lookup(request) {
      if (client === undefined) {
        throw new Error('El proveedor educativo no está configurado.')
      }

      let parsed: EducationalOutput
      try {
        parsed = educationalOutputSchema.parse(
          await client.generate({
            text: request.text,
            model,
            instructions,
            timeoutMs,
          }),
        )
      } catch {
        throw new Error('No fue posible generar contenido educativo válido.')
      }

      const entry: PronunciationEntry = {
        text: request.text,
        kind: request.text.includes(' ') ? 'phrase' : 'word',
        locale: request.locale,
        ipa: parsed.ipa,
        syllables: parsed.segments,
        translation: parsed.translation,
        example: parsed.example,
        exampleTranslation: parsed.exampleTranslation,
      }

      return { pronunciation: entry, audio: [] }
    },
  }
}
