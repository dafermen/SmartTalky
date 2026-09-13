# Convenciones de código

## Idioma y nombres

Identificadores, rutas y nombres técnicos en inglés. Interfaz, documentación y comentarios educativos en español. Los comentarios explican intención o reglas, no traducen la sintaxis.

## TypeScript

- Modo estricto y sin `any` no justificado.
- `exactOptionalPropertyTypes` y `noUncheckedIndexedAccess` en código Node compartido.
- Imports ESM y extensiones `.js` en imports relativos compilados para Node.
- Tipos sin valores en `@smarttalky/types`; valores reutilizables en `@smarttalky/shared`.
- APIs públicas y lógica no evidente con TSDoc útil.

## Arquitectura

- Componentes React no llaman proveedores externos.
- Controladores/rutas traducen HTTP; los casos de uso contienen coordinación.
- Infraestructura implementa interfaces del dominio/aplicación.
- Dependencias se componen explícitamente; no se usa un contenedor DI.
- Errores operativos se tipan; errores inesperados no se exponen al cliente.

## Formato y lint

Prettier define formato mecánico y ESLint detecta problemas. Un parámetro requerido pero no usado puede comenzar con `_`; las demás variables sin uso siguen siendo error.

```bash
npm run format
npm run format:check
npm run lint
```

## Dependencias

Documente el problema que resuelve cada biblioteca. Use versiones exactas y revise motores/peer dependencies. Cualquier nuevo script de instalación npm debe revisarse y aprobarse de forma específica.

## Commits

Se recomiendan commits convencionales pequeños: `feat:`, `fix:`, `docs:`, `test:`, `refactor:` y `chore:`. No mezcle refactors ajenos con una funcionalidad.
