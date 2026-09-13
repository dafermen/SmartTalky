import { afterEach, describe, expect, it, vi } from 'vitest'

import { isDocumentationEnabled } from './documentation-config'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('interruptor del centro de documentación', () => {
  it('permanece visible para la evaluación cuando no hay configuración', () => {
    vi.stubEnv('VITE_SHOW_DOCUMENTATION', '')
    expect(isDocumentationEnabled()).toBe(true)
  })

  it('se puede retirar explícitamente de la entrega', () => {
    vi.stubEnv('VITE_SHOW_DOCUMENTATION', 'false')
    expect(isDocumentationEnabled()).toBe(false)
  })
})
