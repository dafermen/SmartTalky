/**
 * El centro se muestra durante la evaluación del proyecto.
 * VITE_SHOW_DOCUMENTATION=false lo retira del menú y de las rutas.
 */
export function isDocumentationEnabled() {
  return import.meta.env.VITE_SHOW_DOCUMENTATION !== 'false'
}
