# Instalación

## Requisitos

- Node.js `>=22.12.0`.
- npm `>=10.0.0`.
- Git para control de versiones.

La base se validó con Node.js `24.18.0` y npm `11.16.0`. CI ejecuta la suite tanto en Node 22 como en Node 24.

## Instalación reproducible

Desde la raíz del repositorio:

```bash
npm install
```

En CI o cuando se quiera reproducir exactamente el lockfile:

```bash
npm ci
```

npm tiene aprobado únicamente el script de instalación fijado de `esbuild@0.28.1`, requerido por las herramientas Vite/tsx. Revise cualquier nueva advertencia de `approve-scripts`; no apruebe paquetes en bloque sin comprender su función.

## Configuración local

Copie `.env.example` a `.env` solo si desea cambiar los valores predeterminados. `.env` está ignorado por Git. La API valida `NODE_ENV`, `PORT`, `LOG_LEVEL`, políticas TTS/rate limit y la clave opcional al arrancar.

No se requiere `OPENAI_API_KEY`. Sin ella se usa el recorrido simulado. Para activar OpenAI, añada la clave solo a `.env`; el backend generará en cache miss y persistirá bajo `storage/audio-cache`.

No active `SMARTTALKY_RUN_PAID_TTS`: esa variable existe únicamente para autorizar conscientemente `npm run test:tts:manual` y nunca se usa durante el arranque normal.

### Centro temporal de documentación

Durante la evaluación, `VITE_SHOW_DOCUMENTATION=true` muestra la ruta y el menú **Documentación**. El valor predeterminado también es visible cuando la variable no existe. Para retirarlo de una entrega, configure `VITE_SHOW_DOCUMENTATION=false` y vuelva a compilar.

`npm run docs:publish` copia únicamente los 30 Markdown autorizados a la carpeta pública generada. No publica `.env`, `AGENTS.md`, cachés ni secretos; además, detiene el proceso si detecta un patrón compatible con una clave de API. `predev` y `prebuild` ejecutan esta preparación automáticamente.

## Ejecución

```bash
npm run dev
```

Este comando inicia los workspaces que tienen script `dev`. Para control individual:

```bash
npm run dev --workspace @smarttalky/web
npm run dev --workspace @smarttalky/api
```

## Validación

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Los artefactos aparecen en `dist/` dentro de cada paquete/aplicación y están ignorados por Git. La cobertura aparece en `coverage/` al ejecutar `test:coverage` en un workspace.

## Listado de workspaces

```bash
npm run workspaces:list
```

Los scripts raíz procesan primero configuración/tipos/valores y después aplicaciones, de modo que los consumidores encuentren los paquetes compilados.
