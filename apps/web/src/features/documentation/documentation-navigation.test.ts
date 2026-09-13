import { describe, expect, it } from 'vitest'

import { extractTableOfContents, findDocumentation } from './documentation-navigation'

describe('navegación de documentación', () => {
  it('busca sin depender de mayúsculas ni tildes', () => {
    expect(findDocumentation('ARQUITECTURA').map(({ id }) => id)).toContain(
      'arquitectura',
    )
    expect(findDocumentation('diagnostico').map(({ id }) => id)).toContain(
      'problemas-estandar',
    )
  })

  it('crea anclas estables y distingue encabezados repetidos', () => {
    expect(
      extractTableOfContents(
        '# Título\n\n## Preparación local\n\n### Detalle\n\n## Preparación local',
      ),
    ).toEqual([
      { id: 'preparacion-local', level: 2, line: 3, title: 'Preparación local' },
      { id: 'detalle', level: 3, line: 5, title: 'Detalle' },
      {
        id: 'preparacion-local-2',
        level: 2,
        line: 7,
        title: 'Preparación local',
      },
    ])
  })
})
