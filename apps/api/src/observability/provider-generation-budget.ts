export type ProviderGenerationKind = 'educational-content' | 'text-to-speech'

export interface ProviderGenerationBudget {
  consume(kind: ProviderGenerationKind): void
  snapshot(): {
    used: number
    remaining: number
    resetsAt: string
  }
}

export class ProviderGenerationBudgetExceededError extends Error {
  public constructor() {
    super('Se alcanzó el presupuesto temporal de generaciones externas.')
    this.name = 'ProviderGenerationBudgetExceededError'
  }
}

interface ProviderGenerationBudgetOptions {
  maximum: number
  windowMs: number
  now?: () => number
  onExceeded?:
    ((snapshot: ReturnType<ProviderGenerationBudget['snapshot']>) => void) | undefined
}

/**
 * Límite local compartido entre contenido y audio. No conserva texto, claves ni
 * otra información del usuario.
 */
export function createInMemoryProviderGenerationBudget({
  maximum,
  windowMs,
  now = Date.now,
  onExceeded,
}: ProviderGenerationBudgetOptions): ProviderGenerationBudget {
  if (!Number.isInteger(maximum) || maximum <= 0 || windowMs <= 0) {
    throw new Error('La configuración del presupuesto de proveedor no es válida.')
  }

  let windowStartedAt = now()
  let used = 0
  let exceededWasReported = false

  function refresh(currentTime: number): void {
    if (currentTime - windowStartedAt >= windowMs) {
      windowStartedAt = currentTime
      used = 0
      exceededWasReported = false
    }
  }

  return {
    consume() {
      const currentTime = now()
      refresh(currentTime)
      if (used >= maximum) {
        if (!exceededWasReported) {
          exceededWasReported = true
          onExceeded?.({
            used,
            remaining: 0,
            resetsAt: new Date(windowStartedAt + windowMs).toISOString(),
          })
        }
        throw new ProviderGenerationBudgetExceededError()
      }
      used += 1
    },
    snapshot() {
      const currentTime = now()
      refresh(currentTime)
      return {
        used,
        remaining: maximum - used,
        resetsAt: new Date(windowStartedAt + windowMs).toISOString(),
      }
    },
  }
}
