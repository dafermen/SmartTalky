import { describe, expect, it, vi } from 'vitest'

import {
  createOpenAiEducationalContentProvider,
  DEFAULT_OPENAI_EDUCATIONAL_MODEL,
  type OpenAiEducationalClient,
} from './openai-educational-content-provider.js'

const output = {
  ipa: '/wɝld/',
  segments: [{ text: 'world', stressed: true }],
  translation: 'mundo',
  example: 'The world is beautiful.',
  exampleTranslation: 'El mundo es hermoso.',
}

describe('proveedor educativo OpenAI', () => {
  it('envía una solicitud acotada y devuelve el contrato público', async () => {
    const generate = vi
      .fn<OpenAiEducationalClient['generate']>()
      .mockResolvedValue(output)
    const provider = createOpenAiEducationalContentProvider({
      client: { generate },
      timeoutMs: 1234,
    })

    await expect(
      provider.lookup({ text: 'world', locale: 'en-US', modes: [] }),
    ).resolves.toEqual({
      pronunciation: {
        text: 'world',
        kind: 'word',
        locale: 'en-US',
        ipa: '/wɝld/',
        syllables: output.segments,
        translation: 'mundo',
        example: 'The world is beautiful.',
        exampleTranslation: 'El mundo es hermoso.',
      },
      audio: [],
    })
    expect(generate).toHaveBeenCalledWith({
      text: 'world',
      model: DEFAULT_OPENAI_EDUCATIONAL_MODEL,
      instructions: expect.stringContaining('inglés estadounidense'),
      timeoutMs: 1234,
    })
  })

  it('rechaza salida incompleta y no filtra el detalle privado', async () => {
    const detail = 'Authorization sk-no-mostrar'
    const client = {
      generate: vi.fn<OpenAiEducationalClient['generate']>().mockRejectedValue(detail),
    }

    const error = await createOpenAiEducationalContentProvider({ client })
      .lookup({ text: 'world', locale: 'en-US', modes: [] })
      .catch((reason: unknown) => reason)

    expect(String(error)).not.toContain(detail)
    expect(String(error)).toContain('contenido educativo válido')
  })

  it('exige al menos un segmento acentuado', async () => {
    const client = {
      generate: vi
        .fn<OpenAiEducationalClient['generate']>()
        .mockResolvedValue({ ...output, segments: [{ text: 'world', stressed: false }] }),
    }

    await expect(
      createOpenAiEducationalContentProvider({ client }).lookup({
        text: 'world',
        locale: 'en-US',
        modes: [],
      }),
    ).rejects.toThrow('contenido educativo válido')
  })
})
