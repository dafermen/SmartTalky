# Registro de cambios

Todos los cambios relevantes se documentarán aquí siguiendo una estructura inspirada en Keep a Changelog.

## [Sin publicar]

### Corregido

- CI construye los paquetes internos antes del typecheck y mutation testing,
  por lo que una instalación limpia ya no depende de artefactos `dist/`
  locales; el trabajo de mutaciones dispone de un límite acorde a su duración.

### Añadido

- Staging HTTPS restringido con certificado renovable, pruebas externas,
  medición de 5.000 solicitudes, ensayo de rollback y caché real con proveedor
  falso explícito para validar sin OpenAI.
- Cuatro capturas reales y reproducibles de la aplicación en escritorio, guía,
  centro documental y viewport móvil.
- Playwright E2E para el build empaquetado en Chromium de escritorio y móvil,
  integrado en `release:check` y CI sin OpenAI.
- Prueba de capacidad API de 1.000 solicitudes con concurrencia 25 y
  presupuestos automáticos de p95, p99 y crecimiento RSS.
- Dockerfile multi-stage, Compose endurecido y configuración Nginx/TLS para
  `smarttalky.innovalogic.tech`, con smoke Docker en CI.
- ADR-0004 y runbook de bootstrap TLS, versionado de imágenes, health y
  rollback.
- Línea base Stryker 10 para normalización y contratos compartidos, con informe
  JSON reproducible, umbral de 98% y trabajo independiente de CI.
- Campaña Stryker del backend crítico para identidad de audio, presupuesto,
  CORS, rate limit y errores, con 97,75% y umbral automático de 97%.
- Fuzzing determinista con semilla fija para más de 3.200 entradas Unicode,
  JSON, claves opacas y metadatos/bytes de caché.
- Diez pruebas compartidas adicionales para límites C0/C1, mensajes
  personalizados y variantes válidas o inválidas de contratos.
- Navegación documental agrupada y responsive, búsqueda común, tabla de
  contenido, anterior/siguiente, breadcrumbs y tema claro/oscuro persistente.
- Entradas estándar de arquitectura, API, desarrollo, pruebas, despliegue,
  operaciones, seguridad y diagnóstico, enlazadas con las guías detalladas.
- Matriz verificable de 13 familias previas al despliegue, informe de estado y
  comando estricto `predeploy:check` que bloquea una publicación incompleta.
- Inventario reproducible `THIRD_PARTY_LICENSES.md`, verificación de estructura
  documental y plantillas GitHub ampliadas.
- Capacitor 8.4.2, configuración reproducible, verificador del bundle móvil y proyecto iOS con Swift Package Manager.
- Evaluación de brechas y ADR móvil para red, audio, almacenamiento, navegación, permisos y seguridad.
- Workflow macOS 26 para sincronizar y compilar el proyecto iOS sin firma cuando exista un remoto GitHub.
- Proyecto Android Studio con SDK objetivo 36, APK Debug instalable y scripts de preparación para un dispositivo conectado.
- Matriz Android ampliada con Pixel 6 virtual en Android 15/API 35, además del Samsung S24/API 36.
- Guía de firma Android y checklist previo a Google Play con publicación bloqueada hasta autorización.
- Estado actual canónico, protocolo obligatorio para futuras sesiones y verificación automática de continuidad integrada al release.
- Resolución de URL del backend para el contenedor nativo, CORS con lista explícita y puente local ADB para desarrollo.
- Navegación hash nativa y manejo del botón físico Atrás mediante el complemento oficial de Capacitor.
- Ejemplos rápidos, recorrido de práctica en tres pasos y paneles progresivos para historial, preferencias y datos.
- Símbolo vectorial propio de conversación/voz, aplicado al encabezado y favicon con color de tema del navegador.
- Centro temporal de documentación con 30 fuentes reales, búsqueda por categorías, lector Markdown seguro, guía pedagógica para desarrolladores junior y guía de colaboración en GitHub.
- Motor educativo OpenAI con salida estructurada para IPA, segmentación, acento, traducción y ejemplos, caché SHA-256 separada, deduplicación y respaldo gratuito.
- Corpus lingüístico versionado de 60 palabras y frases con cobertura automática de riesgos fonéticos y guía de revisión humana.
- Presupuesto local compartido para generaciones externas y límites LRU configurables para las cachés educativa y de audio.

### Corregido

- React Router se actualizó a 7.18.3 y `qs` de producción a 6.16.0; la
  auditoría de dependencias productivas quedó en cero vulnerabilidades sin
  recurrir a `--force`.
- Se restauró la jerarquía documental canónica: los archivos operativos vuelven
  a existir solo en la raíz y `docs/SECURITY.md` recuperó la guía técnica,
  separada de la política responsable de reportes.
- Las modalidades gratuitas ahora se distinguen claramente: Lenta usa 75% del ritmo y Profesor reproduce natural, sílabas lentas y natural.
- La voz de OpenAI en modalidad Lenta usa ahora 75% del ritmo; su nueva clave de caché no invalida Natural ni Profesor.
- Profesor con OpenAI construye explícitamente la secuencia palabra, sílabas separadas y palabra, con una versión de instrucciones exclusiva que conserva las cachés Natural y Lenta.
- La consulta de pronunciación ya alcanza la API desde Android; el desarrollo local permite HTTP solo en la variante Debug.
- La compilación web ya no hereda el modo de desarrollo del `.env` backend ni incorpora `jsx-dev-runtime`.

### Cambiado

- `/docs` es la ruta canónica del centro documental; `/documentacion` se
  conserva como redirección compatible y el regreso a la aplicación es
  explícito.
- El servidor web local y el preview usan `127.0.0.1:5180` con puerto estricto;
  se retiraron las referencias a los puertos web anteriores.
- La interfaz usa una paleta más cálida con superficies lavanda y turquesa, fondo neutro y jerarquía de texto renovada.
- La guía educativa da mayor protagonismo a la palabra y convierte Natural, Lenta y Profesor en tarjetas táctiles completas.
- La navegación móvil distribuye Práctica, Acerca de y Documentación en una fila propia para conservar legibilidad.
- La práctica permite copiar palabra, IPA y ejemplo, iniciar otra consulta, filtrar historial/favoritos y contar reproducciones completadas localmente; Profesor muestra su secuencia.
- Práctica, historial y preferencias se cargan bajo demanda; el release aplica un presupuesto automático de JavaScript inicial.

### Pendiente

- Completar E2E/capacidad en staging HTTPS, seguridad de infraestructura y
  aceptación visual antes del despliegue público.
- Compilar el proyecto iOS generado en una Mac con Xcode 26+.

## [0.1.0-rc.1] - 2026-07-18

### Añadido

- Documentación completa de la Fase 0: visión, alcance, requisitos, riesgos, arquitectura, roadmap, tareas, continuidad y ADR inicial.
- Reglas operativas y documentación inicial para colaboración, seguridad y GitHub.
- Monorepo npm con workspaces para web, API, configuración, tipos, utilidades compartidas y UI.
- Scripts raíz delegados y lockfile reproducible sin dependencias externas.
- Aplicación web mínima con React 19, TypeScript 6 y Vite 8, configuración estricta y pantalla inicial en español.
- API Express 5 con TypeScript, cierre controlado, entorno Zod, salud, errores tipados, IDs de solicitud y logs Pino redactados.
- Paquetes separados de configuración TypeScript, tipos lingüísticos y valores compartidos.
- ESLint, Prettier, EditorConfig, Vitest, React Testing Library, Supertest y cobertura V8.
- CI reproducible en Node 22/24 con acciones oficiales y validación integral.
- Tailwind 4 y tokens semánticos con relaciones de contraste verificadas.
- Componentes UI reutilizables de botón, campo y tarjeta.
- Flujo responsive simulado con navegación, formulario, guía educativa y modos natural/lento/profesor.
- Estados vacío/carga/éxito/error/reproducción e internacionalización española con i18next.
- Pruebas de interacción y auditoría automatizada de accesibilidad con axe-core.
- Contratos compartidos de pronunciación para palabra/frase, modalidades, contenido educativo, solicitudes, respuestas y metadatos de audio.
- Pruebas de tipos que rechazan modalidades y tipos MIME fuera del contrato.
- Esquemas Zod estrictos compartidos para solicitudes y respuestas de pronunciación.
- Normalización NFC, separadores Unicode, máximo configurable y rechazo de caracteres de control.
- Endpoint simulado `POST /api/v1/pronunciations` con proveedor inyectable y errores seguros.
- Endpoint `GET /api/v1/audio/:key` con repositorio falso, claves opacas y validación de MIME/tamaño.
- Especificación OpenAPI 3.1 publicada en `/api/v1/openapi.json` con pruebas contractuales.
- Web conectada a la API simulada mediante TanStack Query, con validación de respuesta, cancelación, reintento y proxy configurable.
- Matriz crítica consolidada y documentación de extensión; Fase 3 cerrada con 80 pruebas runtime y pruebas de tipos.
- Puerto `TextToSpeechProvider` neutral con cancelación, bytes, metadatos, errores tipados y proveedor falso determinista sin red.
- Adaptador OpenAI TTS opcional con SDK oficial 6.48.0, snapshot/voz configurables, salida WAV validada y pruebas completamente simuladas.
- Perfiles pedagógicos TTS inmutables y versionados para modos natural, lento y profesor, conectados al adaptador y fijados mediante snapshots.
- Identidad de audio canónica `audio-identity-v1` y clave SHA-256 opaca, con vectores estables y sensibilidad a cada dimensión compatible.
- Repositorio local de audio/metadatos con validación, cache hit/miss, invalidación y publicación atómica.
- Deduplicación concurrente, timeout, reintentos acotados, rate limit HTTP y métricas técnicas sin texto.
- Composición opcional OpenAI/caché en el servidor y prueba manual pagada protegida por doble opt-in.
- Adaptador Web Speech inyectable con detección de soporte, voces, cancelación y errores controlados.
- Reproductor resiliente que prioriza el audio principal y activa respaldo gratuito con origen visible.
- Selector reactivo de voces `en-US` con estado vacío y descarte seguro de preferencias ausentes.
- Historial local deduplicado y limitado, favoritos accesibles y preferencias de voz, velocidad y modalidad.
- Borrado selectivo/total con confirmación y exportación JSON versionada.
- Migraciones de progreso v1/v2 a v3 y recuperación segura ante datos incompatibles.
- Cobertura crítica por riesgo para audio HTML y almacenamiento bloqueado.
- Auditoría ampliada Axe, matriz responsive y checklist de seguridad sin hallazgos críticos.
- Encabezados defensivos API y respuestas seguras para JSON malformado o cuerpos excesivos.
- Timeout de audio principal y exportación JSON reintentable.
- Smoke `demo:check`, guía de demostración gratuita y verificador de enlaces Markdown.

### Cambiado

- TypeScript se fijó en `6.0.3` por compatibilidad declarada con `typescript-eslint`; se documentó la restricción de actualización.
- El repositorio Git se inicializó con rama principal `main`.
- El encabezado móvil usa espaciado adaptable para mantener “Acerca de” en una sola línea a 320 px.
- La Fase 2 se cerró tras verificar en navegador real el reflow, los viewports, el foco visible, el flujo principal y una consola sin errores.
- La Fase 4 se cerró sin llamadas pagadas automáticas; el recorrido sin clave se verificó contra la API compilada.
- La Fase 5 incorporó progreso sin cuentas y distingue en la UI el audio del backend del respaldo Web Speech.
- Rutas Acerca de y 404 se cargan bajo demanda; el JavaScript inicial gzip se redujo 14,6%.
- La Fase 6 cerró accesibilidad, responsive, seguridad, rendimiento, recuperación, demo y documentación del MVP web.

### Próximo

- Evaluación de Capacitor e iOS de la Fase 7, sin publicar ni firmar automáticamente.
