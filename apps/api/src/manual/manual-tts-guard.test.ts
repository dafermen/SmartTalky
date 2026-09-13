import { describe, expect, it } from 'vitest'

import { loadManualTtsConfig } from './manual-tts-guard.js'

describe('protección de la prueba TTS manual', () => {
  it('permanece bloqueada de forma predeterminada aunque exista una clave', () => {
    expect(() => loadManualTtsConfig({ OPENAI_API_KEY: 'secreto-de-prueba' })).toThrow(
      'SMARTTALKY_RUN_PAID_TTS=true',
    )
  })

  it('requiere una clave además de la confirmación explícita', () => {
    expect(() => loadManualTtsConfig({ SMARTTALKY_RUN_PAID_TTS: 'true' })).toThrow(
      'falta OPENAI_API_KEY',
    )
  })

  it('devuelve configuración solo con ambas condiciones y no la imprime', () => {
    expect(
      loadManualTtsConfig({
        SMARTTALKY_RUN_PAID_TTS: 'true',
        OPENAI_API_KEY: '  clave-de-prueba  ',
      }),
    ).toEqual({ apiKey: 'clave-de-prueba' })
  })
})
