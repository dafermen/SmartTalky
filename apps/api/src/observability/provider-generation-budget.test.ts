import { describe, expect, it } from 'vitest'

import {
  createInMemoryProviderGenerationBudget,
  ProviderGenerationBudgetExceededError,
} from './provider-generation-budget.js'

describe('createInMemoryProviderGenerationBudget', () => {
  it('comparte el límite entre tipos de generación y no excede el máximo', () => {
    let currentTime = 100_000
    const exceededSnapshots: Array<{
      used: number
      remaining: number
      resetsAt: string
    }> = []
    const budget = createInMemoryProviderGenerationBudget({
      maximum: 2,
      windowMs: 60_000,
      now: () => currentTime,
      onExceeded: (snapshot) => exceededSnapshots.push(snapshot),
    })

    budget.consume('educational-content')
    budget.consume('text-to-speech')

    let exceededError: unknown
    try {
      budget.consume('text-to-speech')
    } catch (error) {
      exceededError = error
    }

    expect(exceededError).toBeInstanceOf(ProviderGenerationBudgetExceededError)
    expect(exceededError).toMatchObject({
      name: 'ProviderGenerationBudgetExceededError',
      message: 'Se alcanzó el presupuesto temporal de generaciones externas.',
    })
    expect(budget.snapshot()).toEqual({
      used: 2,
      remaining: 0,
      resetsAt: new Date(160_000).toISOString(),
    })
    expect(exceededSnapshots).toEqual([
      {
        used: 2,
        remaining: 0,
        resetsAt: new Date(160_000).toISOString(),
      },
    ])

    expect(() => budget.consume('educational-content')).toThrow(
      ProviderGenerationBudgetExceededError,
    )
    expect(exceededSnapshots).toHaveLength(1)

    currentTime += 60_000
    budget.consume('educational-content')
    expect(budget.snapshot()).toEqual({
      used: 1,
      remaining: 1,
      resetsAt: new Date(220_000).toISOString(),
    })
    budget.consume('text-to-speech')
    expect(() => budget.consume('text-to-speech')).toThrow(
      ProviderGenerationBudgetExceededError,
    )
    expect(exceededSnapshots).toHaveLength(2)
  })

  it.each([
    { maximum: 0, windowMs: 1 },
    { maximum: -1, windowMs: 1 },
    { maximum: 1.5, windowMs: 1 },
    { maximum: 1, windowMs: 0 },
    { maximum: 1, windowMs: -1 },
  ])('rechaza cada configuración insegura: %o', (options) => {
    expect(() => createInMemoryProviderGenerationBudget(options)).toThrow(
      new Error('La configuración del presupuesto de proveedor no es válida.'),
    )
  })

  it('acepta los mínimos configurables', () => {
    const budget = createInMemoryProviderGenerationBudget({
      maximum: 1,
      windowMs: 1,
      now: () => 0,
    })

    expect(budget.snapshot()).toEqual({
      used: 0,
      remaining: 1,
      resetsAt: new Date(1).toISOString(),
    })
  })

  it('actualiza snapshot al vencer la ventana aunque no exista consumo', () => {
    let currentTime = 10
    const budget = createInMemoryProviderGenerationBudget({
      maximum: 1,
      windowMs: 10,
      now: () => currentTime,
    })

    budget.consume('educational-content')
    currentTime = 20

    expect(budget.snapshot()).toEqual({
      used: 0,
      remaining: 1,
      resetsAt: new Date(30).toISOString(),
    })
  })

  it('puede bloquear sin callback de alerta configurado', () => {
    const budget = createInMemoryProviderGenerationBudget({
      maximum: 1,
      windowMs: 10,
      now: () => 0,
    })

    budget.consume('educational-content')

    expect(() => budget.consume('text-to-speech')).toThrow(
      ProviderGenerationBudgetExceededError,
    )
  })
})
