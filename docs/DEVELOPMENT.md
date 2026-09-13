# Desarrollo

Esta guía es la entrada estándar para preparar el entorno y cambiar SmartTalky.
La explicación paso a paso para una persona junior está en
[Guía del desarrollador junior](12-guia-desarrollador-junior.md).

## Primer inicio

Requisitos: Node.js 22.12 o posterior y npm 10 o posterior.

```bash
npm install
npm run continuity:check
npm run dev
```

Puede copiar `.env.example` a `.env`; nunca sustituya los valores de ejemplo en
el archivo versionado ni comparta el `.env` local. Sin clave, la aplicación usa
el proveedor simulado y conserva el recorrido gratuito.

## Antes de cambiar algo

1. Lea `AGENTS.md` y `CURRENT_STATUS.md`.
2. Lea `README.md`, `docs/ROADMAP.md`, `docs/TASKS.md` y el final de
   `docs/CONTINUATION.md`.
3. Ejecute `npm run continuity:check`.
4. Conserve cambios existentes y seleccione una sola tarea disponible.

## Comandos habituales

| Comando | Uso |
|---|---|
| `npm run dev` | Inicia los workspaces con servidor de desarrollo. |
| `npm test` | Ejecuta pruebas sin red ni servicios pagos. |
| `npm run release:check` | Valida una candidata local. |
| `npm run deployment:status` | Informa qué puertas faltan para producción. |
| `npm run predeploy:check` | Puerta estricta antes de desplegar públicamente. |
| `npm run docs:check` | Comprueba enlaces Markdown. |
| `npm run licenses:generate` | Regenera el inventario de terceros. |

## Cómo ubicar una modificación

- Pantallas, i18n y experiencia: `apps/web/src/`.
- API y proveedores: `apps/api/src/`.
- Contratos compartidos: `packages/types` y `packages/shared`.
- Componentes visuales comunes: `packages/ui`.
- Decisiones y procedimientos: `docs/`.
- Automatizaciones locales: `scripts/`.
- Validación remota: `.github/workflows/`.

Añada la prueba junto al archivo o dominio que modifica. Actualice documentación,
`CHANGELOG.md`, `docs/CONTINUATION.md` y `CURRENT_STATUS.md` cuando corresponda.
Consulte también [convenciones de código](13-convenciones-de-codigo.md),
[contribución](../CONTRIBUTING.md) y [solución de problemas](TROUBLESHOOTING.md).

## Licencia

`THIRD_PARTY_LICENSES.md` inventaría dependencias, pero no licencia el código
propio. El archivo raíz `LICENSE` se creará únicamente cuando el propietario
elija los términos; mientras falte, no se debe asumir permiso de redistribución.
