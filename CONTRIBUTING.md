# Contribuir a SmartTalky

Antes de trabajar, lea `AGENTS.md`, `docs/TASKS.md` y `docs/CONTINUATION.md`. Seleccione una tarea disponible, mantenga una sola en progreso y limite el cambio a sus criterios.

## Flujo propuesto

1. Cree una rama breve desde `main`.
2. Implemente código, pruebas y documentación en el mismo cambio.
3. Ejecute formato, lint, typecheck, pruebas y build.
4. Use commits convencionales, por ejemplo `docs: define product vision`.
5. Complete la plantilla de pull request y no oculte validaciones fallidas.

Nunca incluya `.env`, claves, audios generados, `node_modules` ni datos locales.

## Validación obligatoria

```bash
npm run release:check
```

Use `npm run format` para aplicar formato antes de repetir la validación. CI
ejecuta la misma secuencia en Node 22 y 24.

Si el cambio prepara o ejecuta un despliegue, también debe completar la evidencia
de las [13 puertas](docs/TESTING.md) y obtener resultado verde en:

```bash
npm run predeploy:check
```

No se debe suavizar una puerta, cambiar su estado ni ocultar una falla para
permitir un despliegue. Una excepción requiere decisión explícita, riesgo,
vigencia y compensación documentados.

Las pruebas se ubican junto al código por dominio; no es necesario crear una
carpeta raíz `test/`. Si cambian dependencias, regenere y verifique
`THIRD_PARTY_LICENSES.md`.
