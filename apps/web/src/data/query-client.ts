import { QueryClient } from '@tanstack/react-query'

/** Crea un cliente aislable para evitar compartir caché entre pruebas o raíces. */
export function createSmartTalkyQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}
