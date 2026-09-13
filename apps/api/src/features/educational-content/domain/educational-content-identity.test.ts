import { describe, expect, it } from 'vitest'

import { createEducationalContentKey } from './educational-content-identity.js'

const base = {
  text: 'comfortable',
  locale: 'en-US' as const,
  model: 'gpt-5.6',
  promptVersion: 'educational-content-v1',
}

describe('identidad de contenido educativo', () => {
  it('es determinista, opaca y cambia con cada dimensión', () => {
    const key = createEducationalContentKey(base)
    expect(key).toMatch(/^[a-f0-9]{64}$/)
    expect(key).not.toContain(base.text)
    expect(createEducationalContentKey(base)).toBe(key)

    for (const changed of [
      { ...base, text: 'hello' },
      { ...base, model: 'otro-modelo' },
      { ...base, promptVersion: 'v2' },
    ]) {
      expect(createEducationalContentKey(changed)).not.toBe(key)
    }
  })
})
