import { describe, expect, it } from 'vitest'

import { resolveApiUrl } from './api-url'

describe('resolveApiUrl', () => {
  it('conserva la ruta relativa para la web', () => {
    expect(resolveApiUrl('/api/v1/health', undefined)).toBe('/api/v1/health')
  })

  it('usa la API del laptop en una compilación Android de dispositivo', () => {
    expect(resolveApiUrl('/api/v1/health', 'http://127.0.0.1:3000')).toBe(
      'http://127.0.0.1:3000/api/v1/health',
    )
  })

  it('rechaza protocolos y rutas ajenas a la API', () => {
    expect(() => resolveApiUrl('/otra-ruta', 'http://127.0.0.1:3000')).toThrow(
      'ruta de API',
    )
    expect(() => resolveApiUrl('/api/v1/health', 'file:///tmp/api')).toThrow(
      'HTTP o HTTPS',
    )
  })
})
