import type { PronunciationProvider } from '../../pronunciation/application/get-pronunciation.js'

/** Conserva la práctica disponible si el proveedor educativo externo falla. */
export function createFallbackEducationalContentProvider(
  primary: PronunciationProvider,
  fallback: PronunciationProvider,
): PronunciationProvider {
  return {
    async lookup(request) {
      try {
        return await primary.lookup(request)
      } catch {
        return fallback.lookup(request)
      }
    },
  }
}
