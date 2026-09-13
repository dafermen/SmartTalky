# SmartTalky

SmartTalky es una aplicación para que personas hispanohablantes aprendan y practiquen pronunciación clara del inglés estadounidense. El producto se construye de forma incremental, con interfaz en español, accesibilidad y control de costos desde la arquitectura.

## Estado del proyecto

Las **Fases 1 a 6** están implementadas y la **Fase 8 Android está completa**. SmartTalky `0.1.0-rc.1` es una candidata verificable y no publicada: interfaz responsive conectada a Express, contenido educativo y TTS OpenAI opcionales, respaldo gratuito Web Speech, progreso local administrable, cachés limitadas, OpenAPI, pruebas, demo sin costo y CI. Android fue verificado en un Samsung S24/API 36 y un Pixel 6 virtual/API 35; iOS sigue pendiente de una compilación real en macOS/Xcode. No se necesita una clave ni una cuenta para ejecutar el recorrido gratuito.

## Vista real

![Inicio de SmartTalky en escritorio](docs/images/smarttalky-inicio-escritorio.png)

![Guía real de pronunciación de hello](docs/images/smarttalky-guia-pronunciacion.png)

Las capturas se generan desde el build real con el backend simulado mediante
`npm run screenshots:capture`; no usan la clave de OpenAI. La
[demostración ilustrada](docs/17-demo-mvp-web.md) incluye también el centro
documental y la vista móvil.

## Funcionalidad disponible

- Web React + TypeScript + Vite con Tailwind, rutas e interfaz en español.
- Formulario validado conectado a la API simulada mediante TanStack Query.
- Modos natural, lento y profesor con audio principal y respaldo Web Speech recuperable.
- Selector reactivo de voces `en-US`, velocidad y modalidad preferida.
- Historial deduplicado, favoritos, exportación JSON y limpieza local con confirmación.
- Migraciones v1/v2/v3 a v4 y recuperación segura ante almacenamiento incompatible.
- Estados vacío, carga, éxito y error; navegación y página informativa.
- API Express + TypeScript con salud, pronunciación simulada y entrega controlada de audio.
- Configuración de entorno validada con Zod.
- Errores HTTP consistentes, IDs de solicitud y logs JSON con redacción.
- Paquetes compartidos de tipos, valores lingüísticos y configuración TypeScript.
- Puerto TTS con proveedor falso y adaptador OpenAI opcional probado únicamente con mocks.
- Caché local SHA-256 con invalidación, deduplicación concurrente y publicación atómica.
- Timeout, reintentos acotados, rate limit y métricas técnicas sin texto del usuario.
- Contratos Zod compartidos, normalización Unicode y límites de entrada verificados.
- ESLint, Prettier, Vitest, React Testing Library y Supertest.
- CI en Node.js 22 y 24 para formato, lint, tipos, pruebas y build.
- Auditorías de accesibilidad, responsive, seguridad, recuperación y rendimiento documentadas.
- Rutas y paneles secundarios diferidos; JavaScript inicial de producción en 138,9 KiB gzip incluyendo sus dependencias iniciales.
- Proyecto Android Studio reproducible con navegación nativa, conexión local de desarrollo y permisos mínimos.
- Experiencia principal renovada con ejemplos rápidos, guía protagonista, modalidades táctiles y controles secundarios plegables.

## Arquitectura resumida

```text
apps/web       React + Vite (interfaz)
apps/api       Express (API y futuras integraciones)
packages/types Contratos TypeScript sin valores de ejecución
packages/shared Valores y utilidades compartidos
packages/config Configuración común de TypeScript
packages/ui    Botones, campos y tarjetas reutilizables
storage/       Audio y datos generados, ignorados por Git
docs/          Producto, arquitectura, operación y continuidad
```

Consulte la entrada estándar de [Arquitectura](docs/ARCHITECTURE.md), la
[descripción detallada](docs/03-arquitectura.md) y
[ADR-0001](docs/adr/0001-arquitectura-inicial.md).

## Requisitos

- Node.js 22.12 o posterior; CI también valida Node 24.
- npm 10 o posterior.

El entorno usado para cerrar la Fase 1 fue Node.js `24.18.0` y npm `11.16.0`.

## Instalación

```bash
npm install
```

Opcionalmente copie `.env.example` a `.env`. Los valores predeterminados permiten ejecutar la API sin crear ese archivo.

## Desarrollo

Ejecutar todos los workspaces disponibles:

```bash
npm run dev
```

O ejecutar cada aplicación en terminales separadas:

```bash
npm run dev --workspace @smarttalky/web
npm run dev --workspace @smarttalky/api
```

La web usa de forma explícita `http://127.0.0.1:5180`; Vite falla con claridad
si ese puerto está ocupado, en lugar de elegir otro silenciosamente. La API
escucha por defecto en `http://127.0.0.1:3000`; su salud está en
`http://127.0.0.1:3000/api/v1/health`.

Durante desarrollo, Vite redirige `/api` al valor de `SMARTTALKY_API_TARGET`. El predeterminado es `http://127.0.0.1:3000`; puede usar otro puerto sin cambiar código.

## Calidad y compilación

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:mutation
npm run test:fuzz
npm run test:e2e
npm run build
npm run performance:api
npm run docs:check
npm run continuity:check
npm run demo:check
```

`npm run format` modifica automáticamente archivos de código y configuración. Las pruebas no usan red, OpenAI ni servicios pagos.

`test:mutation` ejecuta Stryker sobre el núcleo compartido con umbral de 98%;
no usa red ni proveedores pagos, aunque tarda más que la suite unitaria.
`test:fuzz` reproduce más de 3.200 entradas adversariales con semilla fija y
tampoco utiliza red ni datos reales.
`test:e2e` valida el build real en Chromium de escritorio y móvil con la
clave de OpenAI forzada vacía. `performance:api` mide 1.000 solicitudes
simuladas y aplica presupuestos de latencia y memoria.
`npm run release:check` consolida la validación de una candidata local. Antes de
un despliegue público se deben completar las
[13 familias de pruebas](docs/TESTING.md) y ejecutar:

```bash
npm run deployment:status
npm run predeploy:check
```

El segundo comando es deliberadamente estricto: falla mientras exista una
puerta incompleta y no debe omitirse para publicar.

La preparación productiva usa `Dockerfile`, `compose.production.yml` y las
plantillas Nginx de `deploy/nginx`. La guía de
[despliegue](docs/DEPLOYMENT.md) explica bootstrap TLS, smoke y rollback; no se
debe ejecutar en un servidor hasta que `predeploy:check` esté verde.

La demostración reproducible está en [docs/17-demo-mvp-web.md](docs/17-demo-mvp-web.md). `demo:check` usa un puerto efímero y el proveedor simulado; no necesita `.env`.

## Variables de entorno

| Variable | Predeterminado | Propósito |
|---|---|---|
| `NODE_ENV` | `development` | `development`, `test` o `production`. |
| `HOST` | `127.0.0.1` | Interfaz de escucha de la API; Docker usa `0.0.0.0` dentro de su red privada. |
| `PORT` | `3000` | Puerto TCP de la API. |
| `SMARTTALKY_API_TARGET` | `http://127.0.0.1:3000` | Destino del proxy web durante desarrollo. |
| `LOG_LEVEL` | `info` | Nivel de Pino; use `silent` cuando no quiera salida. |
| `OPENAI_API_KEY` | vacío | Activa TTS OpenAI y caché local en el backend; es opcional. |
| `TTS_TIMEOUT_MS` | `30000` | Tiempo máximo de una síntesis. |
| `TTS_MAX_RETRIES` | `1` | Reintentos adicionales para fallos recuperables, máximo 3. |
| `OPENAI_EDUCATIONAL_MODEL` | `gpt-5.6` | Modelo backend para contenido educativo estructurado. |
| `EDUCATIONAL_TIMEOUT_MS` | `20000` | Espera máxima de contenido educativo. |
| `AUDIO_CACHE_MAXIMUM_BYTES` | `536870912` | Tope LRU de la caché de audio. |
| `EDUCATIONAL_CACHE_MAXIMUM_ENTRIES` | `10000` | Tope LRU de entradas educativas. |
| `PROVIDER_GENERATION_BUDGET_MAXIMUM` | `120` | Generaciones externas admitidas por ventana y proceso. |
| `PROVIDER_GENERATION_BUDGET_WINDOW_MS` | `3600000` | Ventana del presupuesto temporal. |
| `PRONUNCIATION_RATE_LIMIT_MAX` | `30` | Solicitudes admitidas por ventana e IP. |
| `PRONUNCIATION_RATE_LIMIT_WINDOW_MS` | `60000` | Duración de la ventana del rate limit. |
| `TRUST_PROXY_HOPS` | `0` | Proxies controlados frente a Express; producción Docker/Nginx usa `2`. |

Nunca confirme `.env` ni una clave real. La API no imprime la clave y los logs redactan campos sensibles conocidos.

La prueba manual pagada permanece bloqueada salvo que se configuren simultáneamente `OPENAI_API_KEY` y `SMARTTALKY_RUN_PAID_TTS=true`; consulte [OpenAI TTS y caché](docs/07-openai-tts-y-cache.md).

## Documentación y continuidad

Con la web local activa, el centro navegable está en
[`http://127.0.0.1:5180/docs`](http://127.0.0.1:5180/docs). La ruta anterior
`/documentacion` solo se conserva como redirección compatible; los enlaces
nuevos deben usar `/docs`.

El índice completo está en [docs/00-indice.md](docs/00-indice.md). Las entradas
convencionales `ARCHITECTURE`, `API`, `DEVELOPMENT`, `TESTING`, `DEPLOYMENT`,
`OPERATIONS`, `SECURITY` y `TROUBLESHOOTING` se encuentran dentro de `docs/` y
conducen a las guías detalladas. Las pruebas permanecen junto al código de cada
dominio en `apps/` y `packages/`, en lugar de duplicarse bajo una carpeta raíz
`test/`.

Para continuar trabajo, lea primero [AGENTS.md](AGENTS.md) y
[CURRENT_STATUS.md](CURRENT_STATUS.md); después consulte
[TASKS.md](docs/TASKS.md) y el final de
[CONTINUATION.md](docs/CONTINUATION.md). `npm run continuity:check` verifica que
este relevo obligatorio siga disponible y que no existan varias tareas
simultáneas.

## Contribución, seguridad y licencia

Consulte [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), la
[licencia MIT](LICENSE) y el inventario reproducible
[THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
