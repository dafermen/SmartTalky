import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const localWebServer = {
  host: '127.0.0.1',
  port: 5180,
  strictPort: true,
} as const

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, '../..', 'SMARTTALKY_')
  const publicEnvironment = loadEnv(mode, '../..', 'VITE_')
  // El `.env` raíz pertenece al backend y puede declarar NODE_ENV=development.
  // `loadEnv` lo refleja en esta variable interna aunque filtremos por prefijo.
  // La compilación web debe obedecer al modo de Vite para no incluir JSX de desarrollo.
  delete process.env.VITE_USER_NODE_ENV

  const apiProxy = {
    '/api': {
      target:
        environment.SMARTTALKY_API_TARGET ??
        process.env.SMARTTALKY_API_TARGET ??
        'http://127.0.0.1:3000',
    },
  }

  return {
    define: {
      'import.meta.env.VITE_SHOW_DOCUMENTATION': JSON.stringify(
        process.env.VITE_SHOW_DOCUMENTATION ??
          publicEnvironment.VITE_SHOW_DOCUMENTATION ??
          'true',
      ),
      'import.meta.env.VITE_SMARTTALKY_API_BASE_URL': JSON.stringify(
        process.env.VITE_SMARTTALKY_API_BASE_URL ??
          publicEnvironment.VITE_SMARTTALKY_API_BASE_URL ??
          '',
      ),
    },
    plugins: [react(), tailwindcss()],
    server: {
      ...localWebServer,
      proxy: apiProxy,
    },
    preview: {
      ...localWebServer,
      proxy: apiProxy,
    },
  }
})
