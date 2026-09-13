import {
  pronunciationRequestSchema,
  pronunciationResponseSchema,
} from '@smarttalky/shared'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { createApp } from '../app.js'
import {
  openApiDocument,
  pronunciationRequestExample,
  pronunciationResponseExample,
} from './openapi-document.js'

function collectReferences(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(collectReferences)
  }

  if (typeof value !== 'object' || value === null) {
    return []
  }

  const record = value as Record<string, unknown>
  const current = typeof record.$ref === 'string' ? [record.$ref] : []
  return [...current, ...Object.values(record).flatMap(collectReferences)]
}

describe('OpenAPI', () => {
  it('publica un documento OpenAPI 3.1 con las rutas reales', async () => {
    const response = await request(createApp()).get('/api/v1/openapi.json')

    expect(response.status).toBe(200)
    expect(response.body.openapi).toBe('3.1.0')
    expect(Object.keys(response.body.paths)).toEqual([
      '/api/v1/health',
      '/api/v1/pronunciations',
      '/api/v1/audio/{key}',
    ])
  })

  it('mantiene ejemplos compatibles con los esquemas Zod ejecutables', () => {
    expect(pronunciationRequestSchema.parse(pronunciationRequestExample)).toEqual(
      pronunciationRequestExample,
    )
    expect(pronunciationResponseSchema.parse(pronunciationResponseExample)).toEqual(
      pronunciationResponseExample,
    )
  })

  it('no contiene referencias locales rotas', () => {
    const schemaNames = new Set(Object.keys(openApiDocument.components.schemas))
    const references = collectReferences(openApiDocument)

    expect(references.length).toBeGreaterThan(0)
    for (const reference of references) {
      expect(reference).toMatch(/^#\/components\/schemas\/[A-Za-z][A-Za-z0-9]*$/)
      expect(schemaNames.has(reference.split('/').at(-1) ?? '')).toBe(true)
    }
  })

  it('usa operationId únicos', () => {
    const operationIds = Object.values(openApiDocument.paths).flatMap((path) =>
      Object.values(path).map((operation) => operation.operationId),
    )

    expect(new Set(operationIds).size).toBe(operationIds.length)
  })
})
