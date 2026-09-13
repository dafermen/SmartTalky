# Pruebas

La política previa a cualquier publicación, incluidas las 13 familias
obligatorias y su estado verificable, está en
[Estrategia de pruebas y puerta de despliegue](TESTING.md). Este documento
conserva el detalle histórico y técnico de las suites existentes.

## Herramientas actuales

- Vitest como ejecutor.
- jsdom, React Testing Library y jest-dom para la web.
- Supertest para la API sin abrir puertos.
- Cobertura V8 opcional por workspace.
- Playwright con Chromium para E2E empaquetado y capturas reproducibles.

## Suite de la Fase 1

- La web verifica identidad y locale inicial mediante roles accesibles.
- La API verifica configuración predeterminada/válida/inválida.
- Salud y rutas desconocidas verifican contrato, IDs y ausencia de `x-powered-by`.
- El logger verifica que autorización y claves sean redactadas.

## Suite de la Fase 2

- Componentes UI verifican labels, descripción, error, región y botón.
- Rutas verifican navegación entre práctica y acerca de.
- Formulario verifica validación, carga, éxito y error inyectando servicios simulados.
- Tarjeta/modos verifican datos educativos, tres controles, estado de reproducción y bloqueo concurrente.
- i18n verifica español y los cuatro conceptos lingüísticos.
- Axe-core verifica la vista inicial sin violaciones automatizables; color-contrast se excluye en jsdom y se valida con cálculo WCAG documentado.

## Matriz crítica de la Fase 3

| Riesgo | Cobertura | Superficie |
|---|---|---|
| Divergencia TypeScript/runtime | Prueba de tipos y ejemplos analizados por Zod | types/shared/OpenAPI |
| Unicode o identidad inestable | NFC, separadores, caso, puntuación e idempotencia | shared |
| Entrada abusiva | Vacío, 120/121 puntos de código, emoji y C0/DEL/C1 | shared/web/API |
| Respuesta de proveedor inválida | Validación antes de publicar y antes de mostrar | API/web |
| Errores sensibles | 400/404/500 sin detalles internos y con `requestId` | API |
| Rutas de audio inseguras | Clave opaca, formato, MIME, tamaño y `nosniff` | API |
| Contrato desactualizado | Ejemplos Zod, referencias locales y `operationId` únicos | OpenAPI |
| Petición abandonada | `AbortSignal` al desmontar la pantalla | web |
| Fallo temporal | Estado recuperable y segundo intento exitoso | web |
| Dependencia externa accidental | Fakes, fetch simulado y Supertest sin puertos | toda la suite |

El formulario web construye su regla desde `createPronunciationTextSchema`, usando mensajes i18n, para evitar que sus límites diverjan de la API.

## Comandos

```bash
npm test
npm run test:watch --workspace @smarttalky/web
npm run test:coverage --workspace @smarttalky/api
npm run test:e2e
npm run performance:api
```

CI ejecuta formato, lint, typecheck, pruebas y build con Node 22 y 24. No configura claves ni llama OpenAI.

## E2E y capacidad previos al despliegue

`test/e2e/smarttalky.spec.mjs` inicia el build web y la API con la clave
forzada vacía. Valida el recorrido de `hello`, la documentación, sus imágenes
y el ancho del viewport en escritorio y móvil. `screenshots.spec.mjs` produce
las evidencias de `docs/images` únicamente cuando se ejecuta
`npm run screenshots:capture`.

`scripts/check-api-load.mjs` abre Express en un puerto efímero con proveedor
simulado. `release:check` completó 1.000 solicitudes con concurrencia 25:
451,3 req/s, p95 81,3 ms, p99 121,6 ms y crecimiento RSS de 53,9 MiB el
2026-09-13. Falla por encima de 750 ms p95, 1.500 ms p99 o 64 MiB RSS.

Esta evidencia reduce las brechas, pero no reemplaza una repetición en staging
HTTPS ni la observación de CPU, disco, red y rutas de audio/caché.

## Reglas para nuevas pruebas

- Cubrir riesgo y comportamiento observable, no implementación accidental.
- Usar nombres en español que expliquen la regla.
- Evitar dependencias de red, reloj, sistema global o servicios pagos.
- Usar carpetas temporales para futuras pruebas de caché y limpiarlas.
- Probar éxito, error, límites y concurrencia cuando aplique.

La Fase 4 cubre hit/miss, invalidación por dimensión, publicación segura, fallo del último rename, deduplicación concurrente, timeout, reintentos, rate limit, métricas y doble opt-in manual. CI usa exclusivamente proveedores/clientes falsos y directorios temporales.

## Matriz crítica de la Fase 6

La cobertura se revisa por impacto. La línea base al iniciar `ST-601` fue web 88,18% de sentencias y API 96,59%; estos porcentajes orientan, pero no son un objetivo de release.

| Riesgo | Evidencia automatizada | Estado |
|---|---|---|
| Audio principal ausente o fallido | Servicio prueba preferencia, failover, modo profesor y ausencia total; adaptador HTML prueba fin y rechazo | cubierto |
| Web Speech incompatible o cambiante | Fakes prueban soporte, voz ausente, eventos, cancelación, fallo y lista reactiva `en-US` | cubierto |
| Progreso duplicado o ilimitado | Store prueba normalización, deduplicación, orden y límite | cubierto |
| Almacenamiento bloqueado/corrupto | Lectura/escritura fallidas continúan con defaults o memoria; fixtures v1/v2 migran a v3 | cubierto |
| Borrado accidental | UI exige confirmación y prueba cancelación, borrado selectivo y total | cubierto |
| Entrada abusiva o rutas inseguras | Shared/API prueban Unicode, controles, límites, claves opacas, MIME, tamaño y `nosniff` | cubierto |
| Dependencia pagada accidental | Guard test exige doble opt-in; toda la suite usa fakes sin red | cubierto |
| Secretos o texto en observabilidad | Logger, errores, métricas e identidad opaca tienen pruebas negativas | cubierto |
| Fallo temporal sin salida | Web prueba reintento de consulta y reproducción; API prueba timeout/reintentos acotados | cubierto |
| Regresión accesible/responsive | Axe, roles y auditoría manual multiviewport de `ST-602`/`ST-603` | pendiente de auditoría manual |

Los huecos encontrados al medir se cerraron únicamente cuando correspondían a un riesgo de usuario: adaptador HTML de audio y almacenamiento bloqueado. Rutas triviales y ramas defensivas sin impacto independiente no reciben pruebas solo para elevar el porcentaje.

## Auditoría de accesibilidad de la Fase 6

- Axe-core sin violaciones automatizables en inicio, guía educativa completa, controles de progreso, privacidad y 404.
- `color-contrast` permanece fuera de jsdom y se respalda con las relaciones WCAG documentadas en `04-diseno-visual.md`.
- Navegador real: landmarks, jerarquía de encabezados, labels, nombres únicos y estados de favorito/reproducción visibles en el árbol accesible.
- El primer foco por teclado llega a “Saltar al contenido principal”; al activarlo, `#main-content` recibe foco.
- No se detectaron fallos críticos ni controles sin nombre. La verificación responsive continúa en `ST-603`.

## Rendimiento de la Fase 6

El build de producción anterior generaba un único JavaScript inicial de 439,39 kB (135,76 kB gzip). Se aplicó división de código solo a las rutas secundarias Acerca de y 404, conservando la práctica en el recorrido inicial.

| Artefacto | Antes | Después |
|---|---:|---:|
| JavaScript inicial | 439,39 kB | 381,27 kB |
| JavaScript inicial gzip | 135,76 kB | 116,12 kB |
| Reducción gzip inicial | — | 19,64 kB / 14,5% |
| CSS | 23,63 kB | 23,63 kB |

Los chunks secundarios son 1,82 kB para Acerca de y 0,70 kB para 404, más runtime/chunks compartidos. La navegación usa `Suspense` con un estado accesible. No se añadieron dependencias de optimización ni precargas especulativas. En la API, caché previa y deduplicación siguen evitando que el camino costoso se repita; sus pruebas son la evidencia principal de rendimiento del backend.

### Segunda optimización de `ST-619`

Los paneles de práctica, historial y preferencias también se cargan bajo demanda. Además, se separó el `.env` del backend del modo de compilación web: antes se incorporaba accidentalmente `jsx-dev-runtime`.

| Medición de producción | Antes | Después |
|---|---:|---:|
| JavaScript principal | 572,75 kB | 382,07 kB |
| JavaScript principal gzip | 170,12 kB | 116,66 kB |
| Reducción del principal | — | 33,3% |
| Total JavaScript inicial | no presupuestado | 443,1 KiB |
| Total inicial gzip | no presupuestado | 138,9 KiB |

`npm run performance:web` falla si reaparece el runtime JSX de desarrollo o si el total inicial supera 500 KiB/150 KiB gzip. La comprobación forma parte de `release:check`; documentación, historial y preferencias quedan fuera del recorrido inicial hasta que se solicitan.

## Límites operativos de `ST-620`

Las pruebas con carpetas temporales verifican que ambas cachés conservan lo más reciente al alcanzar su tope. Otras pruebas confirman que el presupuesto se comparte entre contenido y voz, se restablece al terminar la ventana y se consume únicamente ante un `cache miss`. No se llama a OpenAI ni se conserva texto en la alerta.

## Corpus lingüístico de `ST-617`

`linguistic-quality-corpus.json` contiene 60 palabras y frases de conversación. Cubre acento, reducción, `th`, flap estadounidense, consonantes róticas, grupos consonánticos, enlace, preguntas, viaje y cortesía. Cada caso declara clase y mínimo de segmentos esperados.

Las pruebas gratuitas comprueban tamaño, unicidad, normalización, clasificación y cobertura de riesgos. No afirman que un modelo produzca una única transcripción válida: una revisión humana debe comparar IPA General American, cobertura completa de segmentos, acento, traducción y naturalidad de ambos ejemplos.

Una evaluación masiva contra OpenAI no forma parte de `npm test` ni de CI. Antes de crearla se debe añadir un guard equivalente al TTS manual, estimar el número de solicitudes y requerir una variable de autorización explícita. Hasta entonces, la revisión real se hará con una muestra pequeña iniciada conscientemente por el propietario.

## Cierre de candidata `0.1.0-rc.1`

`npm run release:check` quedó verde con pruebas de tipos, 36 pruebas shared, 55 web y 92 API: 183 pruebas runtime. También verificó builds, bundle web sin patrones sensibles, 28 archivos Markdown sin enlaces rotos y smoke de demo sin proveedor pagado.
