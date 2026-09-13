import type { PronunciationRequest, PronunciationResponse } from '@smarttalky/types'

import type { PronunciationProvider } from '../../pronunciation/application/get-pronunciation.js'
import type { EducationalContentCache } from './educational-content-cache.js'
import { createEducationalContentKey } from '../domain/educational-content-identity.js'

interface GetOrCreateEducationalContentOptions {
  provider: PronunciationProvider
  cache: EducationalContentCache
  model: string
  promptVersion: string
  now?: () => Date
  beforeGenerate?: (() => void) | undefined
}

/**
 * Reutiliza contenido educativo por texto/modelo/prompt y comparte solicitudes
 * simultáneas para que un cache miss produzca una sola generación.
 */
export function createCachedEducationalContentProvider(
  options: GetOrCreateEducationalContentOptions,
): PronunciationProvider {
  const inFlight = new Map<string, Promise<PronunciationResponse>>()
  const now = options.now ?? (() => new Date())

  return {
    async lookup(request: PronunciationRequest) {
      const key = createEducationalContentKey({
        text: request.text,
        locale: request.locale,
        model: options.model,
        promptVersion: options.promptVersion,
      })
      const cached = await options.cache.findByKey(key)
      if (
        cached !== undefined &&
        cached.model === options.model &&
        cached.promptVersion === options.promptVersion
      ) {
        return { pronunciation: cached.entry, audio: [] }
      }

      const running = inFlight.get(key)
      if (running !== undefined) {
        return running
      }

      const generation = Promise.resolve()
        .then(() => {
          options.beforeGenerate?.()
          return options.provider.lookup({ ...request, modes: [] })
        })
        .then(async (response) => {
          await options.cache.put(key, {
            entry: response.pronunciation,
            model: options.model,
            promptVersion: options.promptVersion,
            createdAt: now().toISOString(),
          })
          return { pronunciation: response.pronunciation, audio: [] }
        })
        .finally(() => {
          inFlight.delete(key)
        })

      inFlight.set(key, generation)
      return generation
    },
  }
}
