# Estrategia de pruebas y puerta previa al despliegue

SmartTalky distingue entre una **candidata local** y una versión **apta para
despliegue público**:

- `npm run release:check` valida código, build, documentación y demo local.
- `npm run deployment:status` muestra el estado real de las 13 puertas.
- `npm run predeploy:check` repite la validación integral y falla si alguna
  puerta obligatoria no tiene estado `complete`.

El estado legible por automatización vive en
[`deployment-gates.json`](deployment-gates.json). No se cambia una puerta a
`complete` sin adjuntar evidencia reproducible en la tarea, el pull request y
`docs/CONTINUATION.md`. Una excepción solo puede aprobarla el propietario, debe
tener riesgo, vigencia y compensación documentados, y no se representa
falsamente como prueba completada.

## Las 13 familias obligatorias

| # | Familia | Qué debe demostrar | Evidencia o brecha actual |
|---:|---|---|---|
| 1 | Pruebas de aceptación | Los criterios del producto y el recorrido de usuario se cumplen. | Demo y recorridos web/Android disponibles; falta aceptación visual final del propietario. |
| 2 | Pruebas unitarias | Funciones, servicios y componentes aislados responden correctamente. | Vitest, RTL y pruebas colocadas junto al código mediante `npm test`. |
| 3 | Propiedades e invariantes | Reglas válidas para grandes conjuntos no cambian: normalización, identidad, límites y corpus. | Invariantes Unicode, claves SHA-256, contratos y corpus lingüístico automatizados. |
| 4 | Mutation testing | Las pruebas fallan cuando se introducen cambios incorrectos deliberados. | Completa: Stryker 10 aplica umbrales 98% shared y 97% API crítica, con informes reproducibles. |
| 5 | Fuzzing | Entradas inesperadas no causan escapes, bloqueos ni corrupción. | Completa: semilla fija y más de 3.200 casos para Unicode, JSON, claves y caché mediante `test:fuzz`. |
| 6 | Integración | Capas reales colaboran correctamente sin depender de servicios pagos. | Express + Supertest, repositorios y cliente web con proveedores simulados. |
| 7 | Contrato | Consumidores y servidor comparten formatos compatibles. | Zod, TypeScript y OpenAPI 3.1 verifican esquemas, ejemplos, referencias y operaciones. |
| 8 | Extremo a extremo | El producto empaquetado completa el recorrido desde UI hasta API/audio. | Completa: Playwright cubre build local y staging HTTPS restringido en escritorio/móvil, además de audio y reutilización de caché real con proveedor falso. |
| 9 | Regresión | Capacidades ya aprobadas permanecen estables. | `release:check`, corpus y demo reproducible. |
| 10 | Seguridad | No se filtran secretos/datos y las defensas resisten abuso autorizado. | Pruebas de entradas, headers, rutas, bundle y auditoría; faltan infraestructura pública y resolución/aceptación de avisos. |
| 11 | Concurrencia y resiliencia | Duplicados, timeout, reintentos, fallos parciales y límites se controlan. | Dedupe concurrente, publicación atómica, recuperación y rate limit automatizados. |
| 12 | Rendimiento y recursos | Latencia, memoria, CPU, disco, red y costo cumplen presupuestos. | Completa: bundle/LRU, carga local y 5.000 solicitudes HTTPS en staging con CPU, memoria, disco y red observados; costo externo cero. |
| 13 | Compatibilidad y despliegue | Versiones soportadas, migración, configuración, rollback y smoke funcionan. | Completa para web: Node 22/24, Docker/Nginx, certificado/renovación, configuración, rollback y smoke restringido verificados. Android API 35/36 conserva su flujo Release separado. |

## Criterios mínimos para completar las brechas

### Mutation testing

- Ejecutar `npm run test:mutation`; usa procesos aislados, no red ni proveedores
  pagos y guarda el informe en
  [`evidence/mutation/shared-baseline.json`](evidence/mutation/shared-baseline.json).
- La línea base del 2026-09-09 instrumentó 73 mutantes en normalización,
  validación y contratos: 72 detectados, uno sobreviviente equivalente y
  puntuación 98,63%. El umbral `break` quedó fijado en 98, por lo que una
  regresión falla tanto localmente como en el trabajo de CI dedicado.
- El sobreviviente reemplaza `codePoint !== undefined` por `true` dentro de
  un `for…of` sobre una cadena. Cada iteración produce un carácter no vacío, así
  que `codePointAt(0)` no puede ser `undefined`; se conserva visible en el
  informe y no se excluye artificialmente.
- La campaña del backend instrumentó otros 178 mutantes en identidad de audio,
  presupuesto, CORS, rate limit y errores seguros: 168 detectados, seis
  controlados por timeout, cuatro equivalentes, cero sin cobertura y 97,75%.
  Su informe está en
  [`evidence/mutation/api-baseline.json`](evidence/mutation/api-baseline.json)
  y su umbral `break` es 97%.
- Los cuatro equivalentes restantes del backend corresponden a UTF-8
  predeterminado en SHA-256, una guarda redundante antes de `Set.has`, acceso
  seguro a propiedades de primitivos y el nombre interno de la única cubeta para
  IP ausente. Permanecen visibles, no excluidos.
- Aplicar mutaciones primero a normalización, validación, identidad de caché,
  presupuesto, permisos y errores.
- Excluir únicamente código generado o declaraciones, con justificación.
- Fijar o elevar umbrales únicamente a partir de una línea base ejecutada.
- Guardar informe y mutantes sobrevivientes como evidencia de la tarea.

### Fuzzing

- Ejecutar `npm run test:fuzz`. La semilla canónica es `0x5eedc0de` y cada
  familia deriva de ella un flujo independiente para reproducir fallos.
- La campaña recorre 2.000 textos con separadores, combinaciones, controles,
  emoji y sustitutos aislados; 751 cadenas JSON aleatorias o profundas; 300
  claves; más de 100 metadatos truncados/aleatorios y 100 entradas
  inconsistentes.
- Los invariantes exigen normalización idempotente, límites por punto de código,
  rechazo de controles, parseo sin excepciones propagadas, claves contenidas y
  caché corrupta tratada como ausencia.
- Usar generadores deterministas con semilla reproducible.
- Incluir Unicode combinado, controles, límites ±1, JSON profundo/malformado,
  claves opacas, MIME y metadatos truncados.
- Un hallazgo nuevo debe conservar la semilla/caso y convertirse en prueba de
  regresión mínima.
- No enviar corpus generado a OpenAI ni a un entorno externo.

### E2E, rendimiento y despliegue

- Ejecutar `npm run test:e2e` contra el build y backend simulado aislado.
  Playwright usa Chromium de escritorio y móvil, y nunca hereda
  `OPENAI_API_KEY`.
- Ejecutar `SMARTTALKY_STAGING_URL=https://... npm run test:e2e:staging` solo
  desde un origen autorizado; valida el certificado sin excepciones, headers,
  UI–API, audio simulado, claves estables y rechazo CORS.
- En staging puede habilitarse `CACHED_FAKE_PROVIDER_ENABLED=true` con la clave
  vacía para recorrer la caché de audio real sin red ni costo. Nunca habilitar
  esta opción en producción pública.
- Ejecutar `npm run performance:api`: 1.000 solicitudes, concurrencia 25,
  umbrales p95/p99 y crecimiento RSS. Una medición pagada requiere autorización
  separada.
- Ejecutar `SMARTTALKY_STAGING_URL=https://... npm run performance:staging`
  desde el origen autorizado y observar simultáneamente CPU, memoria, disco y
  red del host. La ruta de salud evita consumo de proveedor y rate limit.
- Antes de completar estas puertas, repetir en staging HTTPS, cubrir audio/caché
  y observar CPU, disco, red y capacidad durante carga sostenida.
- Verificar HTTPS, CORS, secretos administrados, migración, rollback, health y
  smoke posterior al despliegue.

## Organización

Las pruebas están colocadas junto al código por dominio. Esto equivale a
`unit/`, `integration/`, `contract/` y `fixtures/` sin duplicar la estructura del
monorepo. La suite transversal Playwright vive en `test/e2e/`. Consulte la
[guía detallada existente](14-pruebas.md).

## Registro por despliegue

Cada intento debe conservar:

- commit o versión exacta;
- fecha, responsable y entorno;
- comandos y versiones de herramientas;
- informe de cada puerta y enlaces a evidencia;
- excepciones vigentes;
- resultado, incidencias, rollback y smoke posterior.

Si `npm run predeploy:check` falla, no se despliega a producción pública. Un
staging restringido solo puede crearse con `release:check` y CI verdes,
autorización explícita y el propósito de reunir evidencia pendiente. Corregir o
documentar la decisión del propietario no autoriza por sí solo a publicar una
aplicación ni a consumir un servicio pagado.
