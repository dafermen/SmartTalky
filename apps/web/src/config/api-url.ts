const API_PATH_PATTERN = /^\/api(?:\/|$)/

/**
 * Conserva rutas relativas en web y admite una base HTTP(S) explícita para
 * aplicaciones nativas. La clave de OpenAI nunca forma parte del bundle.
 */
export function resolveApiUrl(
  path: string,
  configuredBaseUrl: string | undefined = import.meta.env.VITE_SMARTTALKY_API_BASE_URL,
): string {
  if (!API_PATH_PATTERN.test(path)) {
    throw new Error('La ruta de API no es válida.')
  }

  const value = configuredBaseUrl?.trim()
  if (value === undefined || value === '') {
    return path
  }

  const baseUrl = new URL(value)
  if (!['http:', 'https:'].includes(baseUrl.protocol)) {
    throw new Error('La base de API debe usar HTTP o HTTPS.')
  }

  return new URL(path, `${baseUrl.origin}/`).toString()
}
