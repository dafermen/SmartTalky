# Scripts del repositorio

Esta carpeta contiene automatizaciones pequeñas y revisables del monorepo.

## Calidad y documentación

- `check-markdown-links.mjs`: comprueba enlaces Markdown locales.
- `check-documentation-structure.mjs`: exige las entradas estándar, plantillas,
  continuidad, entorno e inventario de terceros. Tolera la ausencia de
  `LICENSE` solo mientras README la declare como decisión pendiente.
- `generate-third-party-licenses.mjs`: genera o verifica
  `THIRD_PARTY_LICENSES.md` desde el lockfile.
- `publish-documentation.mjs`: copia una lista cerrada al centro temporal de la
  web y rechaza patrones compatibles con claves.
- `check-continuity.mjs`: verifica archivos de relevo y tarea activa única.

## Release y despliegue

- `check-web-bundle.mjs`: busca secretos y límites del bundle.
- `check-web-performance.mjs`: aplica el presupuesto web.
- `check-deployment-readiness.mjs`: informa las 13 puertas; con `--strict`
  bloquea producción mientras alguna esté incompleta.

`npm run release:check` es la validación local consolidada.
`npm run predeploy:check` añade la puerta estricta de producción. Ninguno llama
servicios pagos.
