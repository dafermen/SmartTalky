# Continuidad de SmartTalky

## Objetivo de la sesión

Mantener una fotografía inequívoca del proyecto para futuras sesiones de Codex y evitar que el historial antiguo se interprete como estado vigente.

## Estado operativo

- **Última tarea completada:** `ST-631` — evidencia visual, GitHub y preparación Docker/Nginx.
- **Tarea actual:** ninguna `EN_PROGRESO`; `ST-613`, `ST-614` y `ST-615` esperan aceptación visual del propietario.
- **Fase 2:** completada.
- **Fase 3:** completada; diez de diez tareas verificadas.
- **Fase 4:** completada; doce de doce tareas verificadas.
- **Fase 5:** completada; nueve de nueve tareas verificadas.
- **Fase 6:** implementación completa; `ST-631` preparó capturas, E2E, carga, GitHub y contenedores, y la puerta estricta conserva 8/13 familias completas.
- **Fase 7:** `ST-701` y `ST-702` completadas; `ST-703` preparada hasta el límite verificable en Windows.
- **Fase 8:** completada localmente; paquete, dos versiones Android, firma Debug, privacidad y checklist verificados sin publicar.
- **Próxima tarea:** actualizar GitHub, verificar CI y preparar staging HTTPS solo con aceptación/autorización; producción exige 13/13.
- **Reanudación obligatoria:** leer `CURRENT_STATUS.md` y ejecutar `npm run continuity:check` antes de elegir trabajo.

## Cambios implementados

- La navegación incorpora **Documentación** y conserva los tres destinos legibles en una fila móvil independiente.
- `/docs` organiza 40 fuentes Markdown reales y cuatro capturas en seis categorías, permite buscar por título, resumen y palabras clave, y muestra cuántos documentos coinciden.
- `/docs/:documentId` presenta Markdown con tabla de contenido, anterior/siguiente, tablas y enlaces internos; mantiene el código desplazable y no interpreta HTML incrustado.
- `/documentacion` y sus identificadores anteriores redirigen a `/docs` para conservar compatibilidad.
- `scripts/publish-documentation.mjs` publica una lista cerrada, excluye archivos operativos/secretos y bloquea patrones compatibles con claves.
- `VITE_SHOW_DOCUMENTATION=false` retira menú y rutas sin borrar las fuentes; la preparación ocurre en `predev` y `prebuild`.
- La guía junior explica la arquitectura como una escuela, el recorrido de una solicitud y cómo corregir o ampliar funciones paso a paso.
- La guía GitHub distingue el estado local actual del futuro flujo de ramas, issues, pull requests, protección y CI.
- `favicon.svg` introduce un globo de conversación con onda de voz, usado también como marca visible del encabezado.
- `index.html` declara favicon SVG, color de tema índigo y un título descriptivo para la pestaña.
- `ST-613` incorpora fondo cálido, superficies lavanda/turquesa y un uso más concentrado del índigo/ámbar.
- El formulario ofrece ejemplos que rellenan el campo sin enviar ni generar audio automáticamente.
- El estado inicial explica Escribe, Escucha y Repite; el resultado recibe foco y desplazamiento al completarse.
- La palabra/traducción encabezan la guía y Natural/Lenta/Profesor son tarjetas táctiles completas con estado de reproducción.
- Historial/favoritos y preferencias/datos se conservan en paneles plegables para reducir ruido visual.
- `android/` contiene el proyecto Android Studio compilable con Capacitor Android `8.4.2`, versión `0.1.0`, SDK mínimo 24 y objetivo 36.
- Los scripts `mobile:sync:android:device` y `mobile:prepare:android:device` construyen la URL local y preparan `adb reverse` sin empaquetar secretos.
- El frontend resuelve la URL absoluta de API/audio en nativo; la API aplica CORS con lista explícita para `http://localhost` y `https://localhost`.
- El manifiesto principal declara solo Internet; HTTP sin cifrar está permitido exclusivamente en Debug para la conexión USB local.
- Android usa historial hash y el complemento oficial `@capacitor/app` para que Atrás vuelva dentro de SmartTalky y cierre solo desde el inicio.
- El Samsung S24 verificó consulta, guía, Natural/Lenta/Profesor, persistencia tras reinicio, Acerca de y botón físico Atrás.
- La interfaz Android pasó en vertical, horizontal y un perfil compacto temporal 720×1280/densidad 320; la configuración física 1080×2340/densidad 480 fue restaurada.
- El respaldo Web Speech conserva el ritmo elegido para Natural y usa un factor `0.75` para Lenta.
- Profesor usa la división silábica educativa cuando existe: palabra natural, cada sílaba lenta y palabra natural.
- `HomePage` entrega los segmentos de la guía al reproductor y cada botón conserva su modalidad propia.
- Capacitor core, CLI e iOS `8.4.2` instalados y fijados por lockfile.
- `capacitor.config.ts` define SmartTalky, `com.smarttalky.app`, `apps/web/dist` e iOS móvil sin contenido remoto.
- `mobile:build`, `mobile:check`, `mobile:sync:ios`, `mobile:check:ios` y `mobile:open:ios` hacen reproducible la preparación.
- `ios/` contiene un proyecto Xcode generado con Swift Package Manager, destino iOS 15, versión `0.1.0` y build `1`.
- El verificador iOS confirma archivos requeridos, identidad, versión, bundle copiado exactamente y ausencia de permisos sensibles declarados.
- `.github/workflows/ios.yml` prepara una compilación sin firma en `macos-26`, con versiones de Xcode registradas y activación manual/por pull request.
- Doc 11 y ADR-0002 registran brechas y decisiones para red, audio, almacenamiento, navegación, permisos, ciclo de vida y seguridad.
- `@smarttalky/types` define palabra/frase, modalidades, entrada educativa, solicitud/respuesta y metadatos de audio.
- `@smarttalky/shared` exporta esquemas Zod estrictos alineados con esos tipos.
- La normalización usa NFC y separadores Unicode sin cambiar mayúsculas/puntuación ni ocultar controles.
- El texto admite como máximo 120 puntos de código por defecto y rechaza C0, DEL y C1.
- `POST /api/v1/pronunciations` valida, normaliza y usa un proveedor falso inyectable.
- El caso de uso vuelve a validar la respuesta del proveedor antes de publicarla.
- `GET /api/v1/audio/:key` valida claves opacas y resuelve un repositorio falso en memoria.
- Los audios simulados son cabeceras WAV de 44 bytes; no contienen pronunciación real y no usan red.
- Activos con MIME o tamaño inseguro no se publican; límite interno de 10 MiB y `nosniff` activo.
- Los errores 400, 404 y 500 mantienen códigos/mensajes seguros y `requestId`.
- `GET /api/v1/openapi.json` publica rutas, esquemas y ejemplos OpenAPI 3.1.
- Las pruebas contractuales comprueban ejemplos contra Zod, referencias locales y `operationId` únicos.
- La web usa una mutation de TanStack Query para consultar `POST /api/v1/pronunciations`.
- El cliente revalida la respuesta con Zod, permite reintentar y aborta la petición al desmontar.
- Vite redirige `/api` al destino configurable `SMARTTALKY_API_TARGET`.
- El formulario web reutiliza `createPronunciationTextSchema`; mensajes i18n y reglas API ya no divergen.
- Docs 03, 05, 06, 12 y 14 describen flujo, contratos, endpoints, extensión y matriz crítica reales.
- `TextToSpeechProvider` recibe texto, locale, modalidad y cancelación sin importar ningún SDK.
- El resultado TTS agrupa bytes y metadatos no sensibles de MIME, proveedor, modelo, voz y duración.
- `TextToSpeechProviderError` clasifica configuración ausente, cancelación, fallo y respuesta inválida, además de indicar si admite reintento.
- El fake TTS devuelve una copia del WAV simulado y permite forzar fallos tipados; sigue siendo el recorrido predeterminado sin clave.
- El SDK oficial `openai` 6.48.0 solo es dependencia del backend.
- El adaptador OpenAI usa un cliente inyectable, salida WAV, snapshot `gpt-4o-mini-tts-2025-12-15` y voz `marin` configurables.
- Sin clave no crea cliente; los fallos del SDK pierden sus detalles privados y no hay reintentos automáticos.
- `speech-instructions-v1` fija perfiles inmutables para natural, lento y profesor; cada uno define instrucciones y velocidad.
- El adaptador envía el perfil correspondiente al SDK, pero las pruebas siguen usando solo el cliente simulado.
- `audio-identity-v1` serializa en orden fijo y genera una clave SHA-256 hexadecimal sin texto visible.
- Las siete dimensiones son texto, locale, voz, modalidad, velocidad, modelo y versión de instrucciones.
- `AudioCacheRepository` persiste bytes y metadatos detrás de un puerto; el adaptador local solo acepta claves SHA-256 y trata corrupción como cache miss.
- `createGetOrCreateSpeech` calcula identidad antes de generar, consulta caché, valida metadatos del proveedor y publica el contrato mínimo.
- Un registro de promesas por clave hace que solicitudes simultáneas compartan generación y se limpia siempre al terminar.
- El repositorio publica audio primero y metadatos al final; cualquier fallo limpia temporales y audio huérfano de la operación.
- El decorador resiliente aplica timeout y reintentos configurables; el adaptador marca 408/409/429/5xx recuperables y HTTP limita 30 solicitudes por minuto/IP.
- Métricas en memoria cuentan hit, miss, generación y error sin etiquetas ni campos para texto/secretos.
- El script manual exige `SMARTTALKY_RUN_PAID_TTS=true` y clave, avisa del costo y elimina su WAV temporal; no se ejecutó la llamada real.
- El proceso del servidor activa `CachingPronunciationProvider` y el repositorio local solo cuando existe `OPENAI_API_KEY`; sin clave conserva fake y arranque gratuito.
- La web encapsula Web Speech detrás de un adaptador inyectable con soporte, voces, cancelación y errores tipados.
- El reproductor prioriza audio del backend, evita el WAV `mock-*` y recupera con Web Speech cuando el audio falta o falla.
- La UI anuncia si reprodujo audio principal o la voz gratuita del navegador y permite reintentar cualquier fallo.
- Las voces se actualizan mediante `voiceschanged`, filtran `en-US` y descartan una selección que desaparece.
- `smarttalky.local-progress` v3 conserva hasta 20 consultas deduplicadas, favoritos y preferencias sin cuentas.
- Voz, velocidad `0.75/1/1.25` y modalidad preferida se validan, persisten y alimentan el reproductor.
- La práctica permite exportar JSON v3, borrar historial/favoritos por separado y restablecer todo con confirmación.
- Fixtures v1 y v2 migran a v3; JSON corrupto o versiones desconocidas recuperan defaults sin bloquear la sesión.
- La página Acerca de y las guías explican datos locales, envío a la API, OpenAI en backend y límites de Web Speech.
- La matriz crítica prioriza riesgos; cerró huecos del adaptador HTML y almacenamiento bloqueado sin perseguir cobertura porcentual.
- Axe cubre inicio, guía completa, privacidad y 404; auditoría manual verificó skip-link, landmarks, labels y estados.
- El flujo ampliado funciona en 320×568, 768×1024 y 1440×900 sin overflow horizontal.
- La API añade CSP/headers defensivos y traduce JSON malformado/cuerpo excesivo a 400/413 sin registrar el cuerpo.
- Acerca de y 404 usan carga diferida; el JS inicial final es 381,27 kB, 116,12 kB gzip.
- Audio HTML tiene timeout de 30 segundos y la exportación bloqueada permite reintentar sin perder datos.
- `demo:check` valida salud, `comfortable` y WAV simulado en un puerto efímero sin clave ni costo.
- `docs:check`, `security:bundle` y `release:check` forman parte del checklist y CI.
- La versión raíz es `0.1.0-rc.1`; paquetes internos privados conservan `0.0.0`.

## Pruebas y validaciones

- Marca `ST-614`: lint, typecheck web, 17 archivos/64 pruebas web, build y revisión de secretos verdes; el favicon quedó presente y referenciado en `dist`.
- Renovación `ST-613`: release integral verde con formato, lint, tipos, 36 shared + 64 web + 97 API, builds, secretos, 30 documentos y demo sin costo.
- La nueva prueba confirma que un ejemplo rápido solo completa el campo y no dispara una consulta ni consumo de OpenAI.
- APK renovado sincronizado, compilado e instalado en el S24; la inspección visual automatizada quedó pospuesta porque el dispositivo estaba bloqueado durante una llamada activa.
- Android: APK Debug compilado e instalado en Samsung `SM-S721B`, Android 16/API 36, 1080×2340 y densidad 480.
- Recorrido Android real: consulta `hello`, guía, tres audios principales, historial tras reinicio, Acerca de y botón Atrás verdes.
- Matriz `ST-803`: vertical, horizontal y perfil compacto 720×1280/densidad 320 verdes; inicio, formulario y navegación detectables.
- Integración Android: URL nativa, CORS, plugin `@capacitor/app`, proyecto y bundle verificados; 17 archivos y 63 pruebas web verdes.
- `release:check` final verde: formato, lint, tipos, 36 shared + 63 web + 97 API, builds, revisión de secretos, 30 documentos y demo sin costo.
- APK final sincronizado, compilado e instalado; inicio e historial persistido visibles. API `3000`, web `5180` y puente ADB quedaron activos.
- Auditoría productiva actual: 2 avisos altos transitivos en `react-router` 7.18.1 por una vulnerabilidad de modo RSC/acciones de servidor; SmartTalky usa modo declarativo cliente y no expone esa superficie. npm no ofrece todavía una versión estable corregida sin reintroducir avisos antiguos.
- Web: 15 archivos y 57 pruebas verdes; las nuevas regresiones cubren los tres botones, ritmo lento y secuencia silábica de Profesor.
- Typecheck web y lint verdes después de `ST-610`; formato corregido y verificado al cierre.
- `mobile:build`, `cap sync ios`, `mobile:check` y `mobile:check:ios` verdes en Windows.
- El verificador móvil ahora también exige runner `macos-26`, build sin firma y ausencia de secretos/equipo de desarrollo en workflow/proyecto.
- La sincronización copió 209 módulos web y fijó Capacitor Swift Package `8.4.2`; el bundle inicial conserva 381,27 kB/116,12 kB gzip.
- Formato y lint quedaron verdes después de excluir el bundle iOS generado de ambas herramientas.
- Regresión posterior: 36 pruebas shared, 55 web y 92 API verdes; typecheck web/API, 29 documentos y auditoría productiva con 0 vulnerabilidades verdes.
- La API y la vista local se restauraron: salud `200` en `3001` y web `200` en `http://127.0.0.1:4174/`.
- No existe `xcodebuild` en esta estación Windows; no se afirma compilación, simulación, firma ni prueba física.
- Shared: 3 archivos y 36 pruebas verdes de contratos, Unicode, límites y controles.
- API: 18 archivos y 90 pruebas verdes de salud, contratos, caché, concurrencia, resiliencia, rate limit, métricas y composición.
- Web: 15 archivos y 47 pruebas verdes; cliente HTTP, failover, voces, progreso local, migraciones, accesibilidad y recuperación.
- El endpoint de pronunciación se prueba con Supertest sin red ni proveedor pagado.
- El endpoint de audio se prueba desde la clave retornada por pronunciación hasta los bytes WAV.
- Formato, lint y typecheck específicos quedaron verdes durante cada incremento.
- La suite integral raíz quedó verde antes de OpenAPI; formato, lint, typecheck y 28 pruebas API quedaron verdes después.
- `packages/shared` usa un `tsconfig.build.json` que excluye pruebas; Vitest ejecuta solo `src`, evitando duplicados en `dist`.
- Flujo real verificado en navegador: web `4174` → proxy → API SmartTalky `3001`, consulta `comfortable`, resultado educativo visible y consola limpia.
- Suite final de Fase 3: formato, lint, typecheck, prueba de tipos, 80 pruebas runtime y build verdes.
- Validación de `ST-401`: lint, typecheck, 34 pruebas API y build API verdes; 6 pruebas cubren éxito, tres modalidades, error y cancelación del fake.
- Suite integral posterior a `ST-401`: formato, lint, typecheck, pruebas de tipos, 86 pruebas runtime y builds web/API verdes.
- Validación de `ST-402`: lint, typecheck, 41 pruebas API y build API verdes; 7 pruebas nuevas usan mocks y cubren configuración ausente, contrato SDK, configuración, límites, fallo y cancelación.
- Validación de `ST-403`: lint, typecheck, 48 pruebas API y build API verdes; 7 pruebas nuevas cubren versión, modalidades, snapshot, inmutabilidad y parámetros por modo.
- Validación de `ST-404`: lint, typecheck, 58 pruebas API y build API verdes; 10 pruebas nuevas cubren vector canónico, SHA-256, cada dimensión y velocidades inválidas.
- Suite integral al cerrar `ST-404`: formato, lint, typecheck, pruebas de tipos, 110 pruebas runtime y builds web/API verdes.
- Validación de `ST-405`: lint, typecheck y 63 pruebas API verdes; 5 pruebas nuevas usan directorios temporales para lectura, corrupción, traversal, consistencia y secretos.
- Validación de `ST-406`: lint, typecheck y 68 pruebas API verdes; 5 pruebas nuevas cubren miss, hit, versión, incompatibilidad y contrato público.
- Validación de `ST-407`: lint, typecheck y 70 pruebas API verdes; 2 pruebas nuevas cubren ocho solicitudes concurrentes y reintento tras fallo.
- Validación de `ST-408`: lint, typecheck y 71 pruebas API verdes; el fault test fuerza el último rename y confirma que no queda audio parcial ni temporal.
- Validación de `ST-409`: 77 pruebas API verdes antes de ampliar clasificación; timeout, fallo permanente, cancelación, rate limit/reset y estados recuperables quedan cubiertos sin red.
- Validación de `ST-410`: 85 pruebas API verdes; 3 pruebas nuevas de métricas y 5 casos adicionales de clasificación recuperable.
- Validación de `ST-411`: 88 pruebas API verdes; 3 guard tests prueban bloqueo predeterminado, clave obligatoria y doble opt-in.
- Suite integral de cierre: formato, lint, typecheck, pruebas de tipos, 142 pruebas runtime y builds web/API verdes.
- Smoke compilado sin clave en `127.0.0.1:3002`: POST de `hello` respondió 200 con guía y WAV simulado; proceso cerrado correctamente.
- Build web: 201 módulos, 422.68 kB JS (131.25 kB gzip).
- Validación de Fase 5: formato, lint, typecheck, pruebas de tipos, 173 pruebas runtime y builds web/API verdes.
- Build web actualizado: 209 módulos, 439.39 kB JS (135.76 kB gzip).
- Recorrido real en navegador integrado `4174`: consulta `comfortable`, guía, historial, favorito, preferencias persistentes tras recarga y respaldo Web Speech visible.
- Página Acerca de verificada con privacidad y origen del audio; consola final sin errores ni advertencias.
- Cobertura inicial Fase 6: web 88,18% sentencias y API 96,59%; se añadieron solo pruebas vinculadas a riesgos.
- Auditoría de producción: `npm audit --omit=dev` con 0 vulnerabilidades.
- Cierre `release:check`: formato, lint, tipos, 36 shared + 55 web + 92 API, builds, bundle, 28 Markdown y demo verdes.
- Recorrido final en navegador `4174`: guía `comfortable`, Web Speech, ruta diferida Acerca de y consola limpia.

## Decisiones y riesgos

- Mantener `react-router-dom` 7.18.1, la versión estable más reciente, y actualizar cuando exista una corrección compatible. No ejecutar `npm audit fix --force`: actualmente propone un downgrade con vulnerabilidades antiguas.
- El identificador `com.smarttalky.app` es provisional hasta la decisión final de identidad de tienda; debe confirmarse antes de publicar.
- iOS usa archivos web incluidos y Swift Package Manager; no carga una web remota.
- El MVP mantiene `localStorage` y Web Speech como respaldo, sin plugins ni permisos sensibles hasta que una prueba real demuestre la necesidad.
- `ST-704`–`ST-708` siguen pendientes porque dependen de una compilación real de `ST-703`. Android se adelantó como una cadena independiente por autorización explícita del propietario y ADR-0003.
- El workflow iOS no se ejecutó porque el repositorio sigue sin commit/remoto por decisión del propietario; su presencia no sustituye evidencia verde.
- `packages/shared` aloja validadores y utilidades runtime; `packages/types` conserva contratos/literales mínimos.
- Los controles no se limpian: permanecen visibles para que el esquema los rechace.
- Las claves falsas no incorporan texto del usuario ni rutas de archivo.
- El WAV falso es silencio estructural para probar transporte; la UI debe seguir indicando que no existe audio real.
- El puerto TTS no conoce HTTP, almacenamiento ni tipos del SDK; sus mensajes de error son internos.
- OpenAI quedó conectado de forma opcional en la composición del servidor, pero no se consumieron servicios pagos durante el desarrollo o las pruebas.
- El navegador puede implementar Web Speech local o remotamente; SmartTalky no promete procesamiento exclusivamente local.
- La persistencia es por perfil de navegador y no sincroniza dispositivos; ante fallo de escritura la sesión continúa en memoria.
- El historial se limita a 20 elementos y usa texto normalizado en minúsculas como identidad de deduplicación.
- La identidad recibe texto ya normalizado; la normalización sigue siendo responsabilidad del límite de solicitud antes de calcular la caché.
- El conector MCP de documentación oficial no pudo registrarse por una denegación de ejecución de Codex; `ST-402` se verificó contra la guía pública oficial de OpenAI.
- El puerto local `3000` estaba ocupado por otra aplicación; la verificación usó `3001` mediante configuración, sin cambiar el predeterminado del proyecto.
- Sin commit, remoto ni licencia por decisión del propietario hasta el final.
- La instancia `4173` muestra correctamente el error recuperable porque no está conectada a la API; la instancia integrada y entregable es `http://127.0.0.1:4174/` con API local en `3001`.
- `0.1.0-rc.1` es una candidata local: no se creó tag, commit, remoto, despliegue ni publicación.
- Hosting, presupuesto, licencia y aceptación de la candidata siguen siendo decisiones del propietario antes de avanzar o distribuir.

## Instrucción concreta para reanudar

Para continuar, usar `CURRENT_STATUS.md` como fotografía vigente. La siguiente acción requiere decisiones del propietario sobre revisión visual y entorno público. Para reanudar iOS, además de autorización explícita, se necesita una Mac con Xcode 26+ y se debe ejecutar la sección “Verificación necesaria en una Mac” de `docs/11-capacitor-ios-android.md`.

## Verificación operativa de OpenAI TTS — 2026-07-25

- El propietario configuró `OPENAI_API_KEY` únicamente en el `.env` local ignorado por Git; su valor no se mostró ni se registró.
- La API compilada quedó activa en `http://127.0.0.1:3000` y la web en `http://127.0.0.1:5180`.
- Una única generación real autorizada produjo el WAV de `hello` en modalidad Natural mediante OpenAI.
- El resultado persistió audio y metadatos en `storage/audio-cache/` bajo una clave SHA-256 opaca; el WAV generado mide 31.244 bytes.
- Una segunda solicitud HTTP idéntica devolvió la misma clave y dejó sin cambios tanto el audio como sus metadatos, confirmando un `cache hit` sin una nueva generación.
- `GET /api/v1/audio/:key` devolvió `200` para el recurso persistido.
- La caché distingue texto, idioma, voz, modalidad, velocidad, modelo y versión de instrucciones. Natural, Lenta y Profesor se generan como audios distintos una sola vez cada uno y luego se reutilizan.
- `ST-611` redujo la velocidad OpenAI de Lenta de `0.75` a `0.6`, alineándola con el respaldo gratuito. Como la velocidad forma parte de la identidad, solo los audios lentos usan una clave nueva; Natural y Profesor conservan sus entradas.
- Validación de `ST-611`: 27 pruebas TTS focalizadas, typecheck API, build API, formato y 29 documentos verdes. La compilación activa expone velocidad lenta `0.6`; API `3000` y web `5180` responden correctamente.
- `ST-612` corrigió Profesor con OpenAI: el backend entrega al TTS una secuencia explícita `palabra → sílabas separadas → palabra` en vez de confiar en que el modelo deduzca la segmentación desde una instrucción general.
- Profesor usa `speech-instructions-teacher-v2`, mientras Natural y Lenta conservan `speech-instructions-v1`; la versión por modalidad evita regenerar audios ajenos al cambio.
- Validación de `ST-612`: typecheck API verde, 18 archivos y 93 pruebas API verdes, build API verde. Falta únicamente la escucha humana de la nueva generación real, que debe producirse al volver a consultar la palabra.
- El primer intento falló por falta de acceso de red del proceso restringido y no produjo archivos; la API se reinició como proceso local autorizado con acceso de red.
- `SMARTTALKY_RUN_PAID_TTS` permanece desactivado, por lo que el script manual pagado continúa bloqueado por defecto.

## Centro temporal de documentación — 2026-07-25

- La web quedó activa en `http://127.0.0.1:5180/documentacion`; la API continúa en `http://127.0.0.1:3000`.
- El publicador preparó 30 Markdown autorizados y el verificador revisó 31 fuentes sin enlaces locales rotos.
- `release:check` integral quedó verde: formato, lint, tipos, 36 pruebas shared, 71 web, 97 API, builds, secretos, 31 Markdown y demo simulada; 204 pruebas runtime en total.
- Dos pruebas nuevas cubren búsqueda, carga del Markdown y rechazo de HTML ejecutable; el catálogo verifica rutas e identificadores únicos.
- Chrome revisó el índice a 1440 px y el lector en el layout móvil menor a 640 px. La navegación usa una fila móvil propia y los bloques de código permanecen contenidos con desplazamiento interno.
- El bundle principal no incorpora el lector Markdown hasta abrir la ruta; el chunk diferido de documentación mide 201,75 kB sin comprimir y 58,80 kB gzip.
- No se creó remoto, commit, despliegue ni recurso externo; la publicación sigue siendo local y reversible con `VITE_SHOW_DOCUMENTATION=false`.

## Maduración web, operación y Android — 2026-07-25

### Cambios completados

- `ST-616`: contenido educativo estructurado mediante Responses API, modelo configurable, caché SHA-256 atómica, deduplicación concurrente y respaldo gratuito.
- `ST-617`: corpus versionado de 60 casos y diez riesgos lingüísticos, con invariantes automáticas y protocolo humano sin llamadas pagadas masivas.
- `ST-618`: copiar palabra/IPA/ejemplo, nueva práctica con foco, búsqueda de historial/favoritos y contador local de reproducciones exitosas con migración a esquema v4.
- `ST-619`: práctica, historial y preferencias diferidos; se eliminó `jsx-dev-runtime` del build de producción y se añadió un presupuesto automático de 500 KiB/150 KiB gzip para el JavaScript inicial.
- `ST-620`: LRU por fecha de acceso, tope de 512 MiB de audio, máximo de 10.000 entradas educativas y presupuesto compartido de 120 generaciones por hora, todos configurables.
- El presupuesto solo se consume ante cache miss y emite una alerta local por ventana sin texto del usuario.
- El WAV simulado ahora contiene 100 ms de PCM válido en vez de una cabecera sin muestras, para que clientes estrictos puedan decodificar el recurso de prueba.
- `ST-804`: Pixel 6 virtual con Android 15/API 35 completó la segunda versión Android junto al S24/API 36.
- `ST-805`: APK Debug verificado con firma RSA de 2048 bits y APK Signature Scheme v2; procedimiento Release documentado sin crear secretos.
- `ST-806`: checklist técnico, privacidad y decisiones para Google Play; AAB, firma Release y publicación siguen bloqueados hasta autorización.

### Evidencia

- `release:check` verde: formato, lint, TypeScript estricto, 36 pruebas shared, 78 web y 115 API (229 runtime), builds, secretos, presupuesto web, 31 Markdown y demo simulada.
- Bundle web: JavaScript principal 382,07 kB/116,66 kB gzip; total inicial 443,1 KiB/138,9 KiB gzip.
- Android 15: APK instalado, consulta `hello`, guía, navegación Atrás, responsive y favorito persistente; sin errores fatales en Logcat.
- OpenAI permaneció apagado durante la prueba del emulador. La voz real Natural/Lenta/Profesor conserva la evidencia previa del S24.
- `npm audit --omit=dev` informa dos avisos altos transitivos de `react-router` por RSC Actions. SmartTalky usa el modo declarativo cliente y no expone esa superficie; el único “fix” ofrecido es un downgrade forzado, por lo que no se aplicó.

### Entorno local añadido

- Android Command-line Tools oficiales `15859902`, plataforma API 35 e imagen `google_apis;x86_64` instaladas en el SDK del usuario.
- AVD creado: `SmartTalky_Pixel6_API35`. Puede iniciarse desde Device Manager; el backend local se alcanza de forma segura con `adb reverse tcp:3000 tcp:3000`.

### Decisiones y siguiente paso

- No se trabajó iOS, no se creó commit/remoto y no se publicó ningún artefacto.
- `ST-613`, `ST-614` y `ST-615` permanecen `EN_REVISION` para la aceptación visual final del propietario.
- Antes de producción todavía deben decidirse dominio/hosting HTTPS, identificador definitivo, licencia, política de privacidad pública, presupuesto mensual compartido y credenciales de firma.
- El siguiente bloque ejecutable sin iOS es preparar el backend HTTPS y un entorno de prueba interno después de esas decisiones; no debe asumirse un proveedor ni crear recursos externos sin autorización.

## Continuidad reforzada — 2026-07-26

- Se creó `CURRENT_STATUS.md` como fotografía autoritativa y breve para nuevas sesiones.
- `AGENTS.md` ahora obliga a leer el estado actual, revisar el tablero/historial y ejecutar `npm run continuity:check` antes de modificar el proyecto.
- `scripts/check-continuity.mjs` verifica archivos obligatorios, fecha, próximo paso y máximo de una tarea `EN_PROGRESO`.
- `continuity:check` forma parte de `release:check`.
- README, índice, roadmap, tareas y la cabecera histórica de este documento se reconciliaron con Android completo y la puerta actual de decisiones.
- `ST-621` quedó `COMPLETADA`; no existe una tarea `EN_PROGRESO`.
- `release:check` verde el 2026-07-26: 229 pruebas runtime, builds, seguridad del bundle, presupuesto de rendimiento, 31 documentos, continuidad y demo sin costo.
- Próximo paso: el propietario debe resolver la revisión visual y las decisiones listadas en `CURRENT_STATUS.md`; no crear infraestructura ni publicaciones antes de ello.

## Documentación estándar y puerta de despliegue — 2026-07-28

### Cambios completados

- `ST-622` creó `docs/ARCHITECTURE.md`, `API.md`, `DEVELOPMENT.md`,
  `TESTING.md`, `DEPLOYMENT.md`, `OPERATIONS.md`, `SECURITY.md` y
  `TROUBLESHOOTING.md` como entradas convencionales enlazadas a las guías
  numeradas, sin duplicar ni reorganizar el monorepo.
- La ubicación colocada de pruebas se documentó como equivalente por dominio a
  unitarias, integración, contrato y fixtures; una futura suite E2E podrá usar
  `tests/e2e/`.
- `docs/deployment-gates.json` registra exactamente las 13 familias solicitadas,
  su evidencia y sus brechas. `deployment:status` informa sin bloquear y
  `predeploy:check` exige 13/13 antes de producción.
- `release:check` ahora valida estructura documental e inventario de licencias.
  CI replica rendimiento, documentación, licencias y continuidad.
- `THIRD_PARTY_LICENSES.md` se genera desde el lockfile y contiene 626
  combinaciones únicas de paquete/versión. No sustituye la licencia propia:
  `LICENSE` continúa pendiente de elección del propietario.
- El centro temporal publica y cataloga 39 fuentes, incluidas las entradas
  estándar y las licencias de terceros.
- Plantillas de issues y pull request incorporan riesgos, regresión, despliegue,
  las 13 puertas y la prohibición de pruebas pagadas.
- La prueba de navegación diferida obtuvo un margen explícito de cinco segundos
  para evitar falsos fallos al cargar el lector Markdown en equipos Windows.

### Evidencia

- `release:check` verde el 2026-07-28: formato, lint, TypeScript estricto, 36
  pruebas shared, 78 web y 115 API (229 runtime), builds, bundle sin secretos,
  presupuesto de 443,1 KiB/138,9 KiB gzip, 41 documentos, 25 elementos
  estructurales, 626 registros de terceros, continuidad y demo simulada.
- `docs:publish` preparó 39 archivos públicos.
- El modo estricto de despliegue terminó con error esperado y confirmó que no
  permite publicar con 6/13 puertas completas.
- No se usó red, OpenAI, infraestructura externa, commit, remoto ni publicación.

### Riesgos y siguiente paso

- Permanecen incompletas aceptación, mutation testing, fuzzing, E2E,
  seguridad de infraestructura, carga/capacidad y compatibilidad/despliegue.
- Los dos avisos transitivos de React Router siguen documentados; no se aplicó
  el downgrade forzado propuesto por auditoría.
- `ST-622` quedó `COMPLETADA` y no existe una tarea `EN_PROGRESO`.
- Siguiente paso técnico local: crear tareas separadas para mutation testing y
  fuzzing con línea base reproducible. Staging, licencia y Release continúan
  dependiendo de las decisiones del propietario.

## Puerto web local 5180 — 2026-07-29

- `ST-623` fijó Vite desarrollo y preview en `127.0.0.1:5180` con
  `strictPort: true`; iniciar `npm run dev --workspace @smarttalky/web` ya no
  depende de argumentos manuales ni elige otro puerto silenciosamente.
- README, estado, diagnóstico, roadmap, tablero, changelog, continuidad y las
  copias públicas autorizadas usan la dirección nueva.
- `mobile:sync:android` reconstruyó y copió el bundle/documentación al proyecto
  Android; los verificadores web y Android quedaron verdes.
- `release:check` verde el 2026-07-29: 229 pruebas runtime, builds, seguridad,
  rendimiento, 41 documentos, estructura, licencias, continuidad y demo sin
  OpenAI.
- Verificación HTTP: web y documentación en 5180 y API en 3000 respondieron
  `200`; se cerraron únicamente los dos procesos Node antiguos que todavía
  escuchaban en el puerto web anterior y este dejó de aceptar conexiones.
- La búsqueda en configuración, fuentes, documentación, archivos públicos y
  assets Android no encontró referencias canónicas a puertos web anteriores.
- `ST-623` quedó `COMPLETADA`; no existe una tarea `EN_PROGRESO`. El siguiente
  paso recomendado no cambia: mutation testing y fuzzing locales, mientras las
  decisiones de infraestructura permanecen con el propietario.

## Ritmo interno de Lenta a 0.75 — 2026-07-29

- `ST-624` cambió únicamente la conducta interna: el perfil OpenAI y el factor
  Web Speech de Lenta usan `0.75`.
- No se modificó `AudioControls`, su insignia, textos, disposición ni ningún
  otro elemento visual, según instrucción del propietario.
- La velocidad ya forma parte de la identidad SHA-256 de audio. Las consultas
  lentas nuevas obtendrán una clave nueva; Natural y Profesor conservan sus
  cachés compatibles.
- Pruebas focalizadas verdes: 29 casos de perfiles/OpenAI/identidad de caché y 9
  casos del reproductor Web Speech.
- `release:check` verde: 36 pruebas shared, 78 web y 115 API (229 runtime),
  formato, lint, tipos, builds, seguridad, rendimiento, 41 documentos,
  estructura, licencias, continuidad y demo simulada.
- No se llamó OpenAI ni se generó audio pagado. `ST-624` quedó `COMPLETADA` y no
  existe una tarea `EN_PROGRESO`.

## Navegación documental estandarizada — 2026-08-01

- `ST-625` conservó el centro React/Markdown existente y evitó introducir una
  segunda herramienta o duplicar las 39 fuentes autorizadas.
- `/docs` es la ruta canónica. `/documentacion` y los identificadores
  históricos redirigen con reemplazo de historial para no romper marcadores.
- El shell documental incorpora SmartTalky Docs, accesos a Producto,
  Arquitectura y Estado, búsqueda local, tema claro/oscuro persistente y un
  enlace nativo “Volver a la aplicación” con destino `/`.
- El escritorio usa una navegación lateral agrupada; en móvil se convierte en
  menú controlado y se cierra al elegir un documento. La página actual se
  identifica con `aria-current`.
- El lector añade breadcrumbs, tabla de contenido con anclas deterministas y
  navegación anterior/siguiente. Los bloques de código conservan desplazamiento
  interno y contraste en ambos temas.
- Se añadieron pruebas de búsqueda sin tildes, anclas repetidas, redirección,
  menú, tema, retorno, TOC y accesibilidad automatizada.
- 24 archivos y 84 pruebas web quedaron verdes; el build final produjo un chunk
  documental de 180,71 kB / 53,38 kB gzip, sin incorporar nuevas dependencias.
- Chrome 150 verificó 1440×1000 y 390×844, claro y oscuro, índice, lector,
  menú, retorno y compatibilidad. No hubo overflow horizontal ni enlaces
  `/docs/docs/`; la revisión detectó y permitió corregir anclas con sufijo y el
  contraste oscuro de bloques de código.
- La web quedó activa en `http://127.0.0.1:5180/` y el centro en
  `http://127.0.0.1:5180/docs`. No se llamó OpenAI, no se creó infraestructura,
  commit, remoto ni publicación.
- `release:check` verde el 2026-08-01: formato, lint, tipos, 36 pruebas shared,
  84 web y 115 API (235 runtime), builds, bundle sin secretos, presupuesto de
  444,4 KiB/139,4 KiB gzip, 41 documentos, estructura, 626 registros de
  terceros, continuidad y demo simulada.
- `ST-625` quedó `COMPLETADA`; no existe una tarea `EN_PROGRESO`. El siguiente
  paso técnico local continúa siendo mutation testing y fuzzing, sujeto al
  orden de decisiones previo a producción registrado en `CURRENT_STATUS.md`.

## Restauración de la jerarquía documental — 2026-09-09

- `ST-626` corrigió un movimiento accidental sin perder contenido: eliminó las
  copias duplicadas `docs/AGENTS.md`, `docs/CHANGELOG.md` y
  `docs/CONTRIBUTING.md`, cuyas fuentes canónicas permanecen en la raíz.
- `docs/SECURITY.md` recuperó la guía técnica; `SECURITY.md` en la raíz
  conserva la política responsable para reportes.
- `docs:structure` verificó 25 elementos obligatorios, `docs:check` revisó 41
  Markdown sin enlaces locales rotos y `docs:publish` preparó 39 fuentes.
- `continuity:check` quedó verde con `ST-626` como única tarea activa durante
  la reparación.
- No se usó OpenAI, red, infraestructura, commit, remoto ni publicación.
- `ST-626` quedó `COMPLETADA`; no existe una tarea `EN_PROGRESO`. El
  siguiente paso técnico local es mutation testing con línea base y umbral
  medidos.

## Línea base compartida de mutation testing — 2026-09-09

- `ST-627` instaló Stryker 10 y añadió `npm run test:mutation`, una
  configuración explícita y un trabajo independiente de CI sobre Node 24.
- La primera medición fue 75,34% (55 detectados y 18 sobrevivientes). Diez
  pruebas nuevas precisaron límites C0/C1, mensajes de error y variantes de
  contratos, elevando la detección real.
- El adaptador directo de Vitest dejó cuatro falsos sobrevivientes por contratos
  creados durante la carga del módulo. Se sustituyó por el ejecutor de comando,
  que inicia Vitest en un proceso nuevo para cada mutante y los detectó.
- La medición definitiva instrumentó 73 mutantes: 72 detectados, uno
  equivalente, cero sin cobertura y 98,63%. El umbral automático quedó en 98%.
- El informe reproducible está en
  `docs/evidence/mutation/shared-baseline.json`. El único sobreviviente y la
  limitación del mutador de expresiones Unicode permanecen explícitos.
- La puerta 4 pasa de `pending` a `partial`: falta ampliar la campaña a
  identidad/caché, presupuesto, permisos y errores del backend antes de
  declararla completa.
- No se llamó OpenAI ni se usaron servicios pagos.
- `release:check` quedó verde con 46 pruebas shared, 84 web y 115 API (245
  runtime), builds, seguridad, rendimiento, 41 documentos, 735 registros de
  terceros, continuidad y demo simulada.
- Una ejecución inicial de `release:check` agotó el límite de cinco segundos
  de una prueba que carga dos rutas web diferidas. El caso pasó aislado en 2,75
  segundos y se le asignó un límite total de diez segundos; la repetición
  integral quedó verde.
- `ST-627` quedó `COMPLETADA`; no existe una tarea `EN_PROGRESO`. El
  siguiente paso local es ampliar mutation testing al backend crítico.

## Mutation testing del backend crítico — 2026-09-09

- `ST-628` añadió una campaña separada para identidad de audio, presupuesto de
  proveedor, CORS, rate limit y traducción segura de errores.
- La primera línea base instrumentó 178 mutantes y obtuvo 71,35%. Los
  sobrevivientes señalaron pruebas generales sobre encabezados, límites,
  ventanas, callbacks, registros y respuestas inesperadas.
- Se añadieron 19 casos API para valores frontera, mensajes exactos, CORS
  completo, contadores, IP independientes, `null`, combinaciones de errores,
  alertas únicas y reinicio de ventanas.
- La medición definitiva detectó 168 mutantes, controló seis por timeout, dejó
  cuatro equivalentes visibles y obtuvo 97,75%, con cero mutantes sin cobertura.
  Presupuesto alcanzó 100%.
- El umbral API quedó en 97%; el compartido permanece en 98%. `test:mutation`,
  CI y `predeploy:check` ejecutan ambas campañas. Los informes están en
  `docs/evidence/mutation/`.
- La puerta 4 de despliegue quedó `complete`: 251 mutantes totales, 240
  eliminados, seis controlados por timeout y cinco equivalentes conservados como
  evidencia.
- No se llamó OpenAI, no se usó red de producto y no se desplegó.
- `release:check` quedó verde con 46 pruebas shared, 84 web y 135 API (265
  runtime), builds, bundle seguro, rendimiento, 41 documentos, 735 registros de
  terceros, continuidad y demo simulada.
- `ST-628` quedó `COMPLETADA`; no existe una tarea `EN_PROGRESO`. La
  siguiente tarea técnica local es fuzzing determinista.

## Fuzzing determinista — 2026-09-09

- `ST-629` añadió `npm run test:fuzz` y una suite API incluida también en la
  regresión normal.
- La semilla canónica `0x5eedc0de` genera de forma reproducible 2.000 textos
  Unicode, 751 candidatos JSON, 300 claves, más de 100 metadatos
  truncados/aleatorios y 100 entradas de caché inconsistentes.
- Se cubren separadores Unicode, combinaciones, controles C0/C1, emoji,
  sustitutos aislados, límites, JSON profundo, traversal, MIME, fechas, tamaño e
  identidad de bytes.
- Cinco pruebas y el typecheck API quedaron verdes en 2,22 segundos de Vitest;
  todos los archivos se crean únicamente en un directorio temporal que se
  elimina al terminar.
- La puerta 5 pasa a `complete`. No se llamó OpenAI, no se usó red, datos
  reales, almacenamiento persistente ni infraestructura externa.
- `release:check` quedó verde con 46 pruebas shared, 84 web y 140 API (270
  runtime), builds, seguridad, rendimiento, 41 documentos, 735 registros de
  terceros, continuidad y demo simulada.
- La carga acumulada reveló otro timeout falso en la auditoría Axe de la ruta
  documental diferida; el caso pasó aislado en 3,16 segundos y su límite total
  quedó en diez segundos, igual que la navegación documental.
- `ST-629` quedó `COMPLETADA`; no existe una tarea `EN_PROGRESO`. La
  siguiente mejora local segura es resolver los avisos de dependencias y
  repetir la auditoría de producción.

## Dependencias de producción saneadas — 2026-09-09

- `ST-630` actualizó React Router/DOM de 7.18.1 a 7.18.3 y resolvió `qs` de
  producción en 6.16.0, dentro de los requisitos actuales del proyecto.
- `npm audit --omit=dev` pasó de tres avisos (dos altos y uno moderado) a cero
  vulnerabilidades.
- `npm audit fix` se ejecutó sin `--force`. La auditoría completa conserva
  cinco avisos moderados en Vitest/Stryker; no forman parte del runtime ni del
  bundle de producción y su corrección propuesta exige forzar rangos.
- La puerta 10 continúa parcial hasta probar infraestructura pública y dar
  seguimiento compatible a las herramientas de desarrollo.
- El inventario de terceros permanece en 735 combinaciones paquete/versión.
- `release:check` quedó verde con 46 pruebas shared, 84 web y 140 API (270
  runtime), builds, bundle seguro, 445,3 KiB/139,7 KiB gzip, 41 documentos,
  licencias, continuidad y demo simulada.
- `ST-630` quedó `COMPLETADA`; no existe una tarea `EN_PROGRESO`. E2E
  público depende de staging; las siguientes mejoras locales posibles son carga
  del backend y preparación de un E2E empaquetado con proveedor simulado.

## Evidencia visual, GitHub y preparación Docker — 2026-09-13

- `ST-631` añadió cuatro capturas PNG generadas con Playwright desde el build
  real y la API simulada: inicio escritorio, guía de `hello`, centro
  documental e inicio móvil 390×844. README, diseño y demo las muestran.
- El publicador copia 40 fuentes Markdown y cuatro imágenes; el lector resuelve
  rutas relativas de imágenes de forma controlada. Ocho E2E verifican práctica,
  API, documentación, imágenes y ausencia de overflow en Chromium escritorio y
  móvil, con `OPENAI_API_KEY` vacía.
- La línea base de carga ejecuta 1.000 solicitudes con concurrencia 25.
  `release:check` midió 451,3 req/s, p95 81,3 ms, p99 121,6 ms y 53,9 MiB de
  crecimiento RSS. Las puertas 8 y 12 siguen parciales hasta repetir audio,
  caché, CPU, disco y red en staging HTTPS.
- Se incorporaron `Dockerfile` multi-stage y `compose.production.yml`.
  Web/API usan usuarios no root, raíz de solo lectura, todas las capacidades
  eliminadas, healthchecks y red privada. Solo web publica
  `127.0.0.1:5182`; API no publica puerto.
- El build y smoke Docker locales quedaron verdes para web, salud,
  pronunciación simulada e imagen documental. La auditoría productiva dentro
  del build informó cero vulnerabilidades.
- El servidor autorizado fue inspeccionado en solo lectura: Ubuntu 24.04,
  Docker 29.8, Compose 5.5, Nginx 1.24, Certbot 2.9, aproximadamente 6 GiB de
  RAM y 26 GiB de disco disponibles. 5180/5181 están ocupados por otro producto;
  5182 está libre. No se alteró ningún servicio remoto.
- `smarttalky.innovalogic.tech` resuelve al servidor, pero HTTPS presenta un
  certificado de otro dominio. Se añadieron bootstrap ACME, plantilla Nginx,
  ADR-0004 y runbook de instalación/rollback; no se emitió certificado ni se
  desplegó porque la puerta estricta permanece en 8/13.
- El remoto `origin` quedó enlazado a
  `https://github.com/dafermen/SmartTalky.git`. Se conservó sin reescritura el
  commit remoto inicial que contiene la licencia MIT. No se hizo push.
- `npm run release:check` quedó verde: formato, lint, tipos; 46 pruebas
  shared, 84 web, 141 API y 8 E2E; builds; bundle seguro; rendimiento web/API;
  42 documentos; 40 fuentes + 4 imágenes; 738 registros de licencias;
  continuidad y demo simulada.
- `npm audit --omit=dev` informa cero vulnerabilidades. La auditoría completa
  conserva cinco avisos moderados en herramientas de desarrollo; el arreglo
  compatible no cambió paquetes y no se usó `--force`.
- El escaneo de patrones no encontró claves ni llaves privadas; `.env` y las
  cachés siguen ignorados. No se llamó OpenAI ni se generaron costos.
- `ST-631` quedó `COMPLETADA`; no existe una tarea `EN_PROGRESO`. El
  siguiente paso es actualizar GitHub, verificar CI y preparar staging HTTPS
  solo después de aceptación y autorización, manteniendo 13/13 como condición
  de producción.
