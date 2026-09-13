import { describe, expect, it } from 'vitest'

import { documentationCatalog, resolveDocumentationEntry } from './documentation-catalog'

describe('catálogo público de documentación', () => {
  it('mantiene identificadores y rutas sin duplicados', () => {
    expect(new Set(documentationCatalog.map(({ id }) => id)).size).toBe(
      documentationCatalog.length,
    )
    expect(new Set(documentationCatalog.map(({ sourcePath }) => sourcePath)).size).toBe(
      documentationCatalog.length,
    )
  })

  it('resuelve enlaces relativos entre documentos', () => {
    expect(resolveDocumentationEntry('06-api.md', 'docs/03-arquitectura.md')?.id).toBe(
      'api',
    )
    expect(resolveDocumentationEntry('../README.md', 'docs/09-instalacion.md')?.id).toBe(
      'readme',
    )
    expect(
      resolveDocumentationEntry(
        'adr/0001-arquitectura-inicial.md',
        'docs/03-arquitectura.md',
      )?.id,
    ).toBe('adr-arquitectura')
    expect(resolveDocumentationEntry('TESTING.md', 'docs/DEPLOYMENT.md')?.id).toBe(
      'pruebas-despliegue',
    )
    expect(
      resolveDocumentationEntry('../THIRD_PARTY_LICENSES.md', 'docs/DEVELOPMENT.md')?.id,
    ).toBe('licencias-terceros')
  })

  it('no intercepta enlaces externos ni anclas', () => {
    expect(resolveDocumentationEntry('https://github.com/', 'README.md')).toBeUndefined()
    expect(resolveDocumentationEntry('#inicio', 'README.md')).toBeUndefined()
  })
})
