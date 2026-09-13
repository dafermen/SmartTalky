# OpenAI TTS y caché

OpenAI TTS está disponible únicamente detrás de `TextToSpeechProvider`. La ausencia de `OPENAI_API_KEY` es un estado soportado: web y API arrancan con el recorrido simulado y no realizan llamadas externas.

## Contenido educativo estructurado

Cuando existe `OPENAI_API_KEY`, un segundo adaptador genera IPA General American, sílabas o segmentos, acento principal, traducción, ejemplo en inglés y traducción del ejemplo. Usa la Responses API con Structured Outputs y un esquema Zod estricto; texto, clase y locale del contrato final se derivan de la solicitud validada y no se aceptan libremente desde el modelo.

El modelo predeterminado es `gpt-5.6`, configurable mediante `OPENAI_EDUCATIONAL_MODEL`; `EDUCATIONAL_TIMEOUT_MS` limita la espera. El prompt `educational-content-v1` está versionado y evita Markdown o explicaciones fuera del esquema. La implementación sigue la [guía oficial de salidas estructuradas](https://developers.openai.com/api/docs/guides/structured-outputs).

La identidad `educational-content-identity-v1` combina texto normalizado, locale, modelo y versión de prompt antes de aplicar SHA-256. `storage/educational-cache` conserva un JSON validado de máximo 64 KiB por clave; una escritura temporal y rename evitan publicar parciales. Solicitudes simultáneas comparten generación. Un fallo, rechazo o timeout cae al contenido determinista gratuito y no se guarda como acierto, permitiendo recuperarse en una consulta futura.

## Puerto de síntesis

El puerto implementado es independiente de OpenAI. Recibe texto, `en-US`, modalidad y una señal de cancelación opcional. Devuelve los bytes de audio junto con tipo MIME, nombre no sensible del proveedor, modelo, voz y duración opcional. Los errores tipados distinguen proveedor no configurado, cancelación, fallo de solicitud y respuesta inválida; además indican si el fallo admite reintento. La capa HTTP no publica automáticamente sus mensajes internos.

El fake actual devuelve un WAV vacío y determinista con metadatos ficticios. Sirve para pruebas y desarrollo, no representa pronunciación real y no realiza llamadas de red.

El adaptador OpenAI usa el SDK oficial `openai` 6.48.0 y `audio.speech.create`. El valor inicial es el snapshot `gpt-4o-mini-tts-2025-12-15`, la voz `marin` y respuesta WAV; modelo y voz pueden inyectarse desde el backend sin ampliar el contrato público. Los reintentos automáticos del SDK están desactivados y la aplicación aplica su propia política acotada. La implementación sigue la [guía oficial de generación de voz](https://developers.openai.com/api/docs/guides/text-to-speech), que también exige informar al usuario que la voz es generada por IA antes de ofrecer reproducción real.

La clave continúa siendo opcional. No se crea un cliente real si está ausente o vacía, las pruebas inyectan un mock y los errores del SDK se reemplazan por clasificaciones internas sin conservar mensajes potencialmente sensibles.

## Identidad y clave

La clave se calculará desde una serialización canónica de texto normalizado, `en-US`, voz, modo, velocidad, versión de prompt/configuración y modelo. Se utilizará un hash criptográfico. Cambiar una dimensión incompatible producirá una clave distinta.

La implementación `audio-identity-v1` selecciona explícitamente el orden de las propiedades y calcula SHA-256 sobre el JSON UTF-8. El resultado es una clave opaca de 64 caracteres hexadecimales; no contiene el texto ni puede convertirse en una ruta proporcionada por el usuario. Un vector fijo y pruebas por dimensión protegen su estabilidad.

## Lectura y generación

1. Validar y normalizar.
2. Calcular identidad y clave.
3. Validar metadatos y archivo existente.
4. Unirse a una promesa en curso si la misma clave ya se genera.
5. Invocar al proveedor solo si es necesario.
6. Escribir bytes y metadatos en archivos temporales dentro del almacenamiento.
7. Publicarlos de manera segura y retirar la operación del registro en curso.

Los fallos no deben dejar un archivo aparentemente válido. Las pruebas usarán proveedores falsos y nunca consumirán OpenAI en CI.

El repositorio guarda `<sha256>.audio` y `<sha256>.json` en `storage/audio-cache`. Valida esquema, identidad, MIME y tamaño en cada lectura. El audio se renombra primero y los metadatos al final; sin metadatos válidos nunca existe un cache hit. Una promesa en curso por clave deduplica solicitudes simultáneas.

## Modo profesor

La configuración versionada solicitará pronunciación natural, seguida de una parte lenta o segmentada con énfasis pedagógico, y una repetición natural. La documentación y la interfaz aclararán que el proveedor no garantiza control fonético perfecto.

Los perfiles son inmutables y cubren exactamente `natural`, `slow` y `teacher`. Natural usa velocidad 1 y `speech-instructions-v1`; Lenta usa velocidad 0.75 con esa misma versión; Profesor usa `speech-instructions-teacher-v2`. Para Profesor, el backend construye explícitamente una secuencia con la palabra completa, cada sílaba como elemento separado y la palabra completa otra vez. Si no existen al menos dos sílabas educativas, repite la entrada completa en la pasada intermedia. Cada perfil publica su propia versión para que un cambio en Profesor no invalide las cachés Natural y Lenta. La velocidad también forma parte directa de la identidad y cambia únicamente la caché de la modalidad afectada.

## Operación y costos

Para activar el proveedor, guarde `OPENAI_API_KEY` únicamente en `.env` o en el gestor de secretos del despliegue y reinicie la API. Nunca incluya la clave en la web. `TTS_TIMEOUT_MS`, `TTS_MAX_RETRIES`, `OPENAI_EDUCATIONAL_MODEL`, `EDUCATIONAL_TIMEOUT_MS`, `PRONUNCIATION_RATE_LIMIT_MAX` y `PRONUNCIATION_RATE_LIMIT_WINDOW_MS` permiten ajustar políticas sin editar código.

La caché actualiza la fecha de acceso de cada acierto y retira primero las entradas menos recientes. `AUDIO_CACHE_MAXIMUM_BYTES` limita el total de pares audio/metadatos (512 MiB por defecto) y `EDUCATIONAL_CACHE_MAXIMUM_ENTRIES` limita los JSON educativos (10.000 por defecto). La limpieza solo considera nombres SHA-256 y extensiones conocidas dentro de los dos directorios controlados.

`PROVIDER_GENERATION_BUDGET_MAXIMUM` limita conjuntamente las generaciones educativas y TTS dentro de `PROVIDER_GENERATION_BUDGET_WINDOW_MS` (120 por hora de manera predeterminada). Los aciertos de caché no consumen el presupuesto. Al agotarse, el servidor registra una sola alerta por ventana sin texto del usuario: el contenido educativo usa su respaldo gratuito y el audio no inicia una llamada pagada. Este límite local por proceso protege accidentes; un despliegue con varias instancias todavía necesita una cuota compartida y alertas del proveedor.

Los contadores locales registran aciertos, misses, generaciones y errores sin texto ni etiquetas. Se reinician con el proceso y todavía no se exportan. El presupuesto temporal también se reinicia con el proceso; no reemplaza un presupuesto mensual de facturación. La migración futura podrá usar almacenamiento de objetos/CDN conservando el puerto del repositorio.

## Prueba manual opt-in

`npm run test:tts:manual` está bloqueado de forma predeterminada. Solo realiza una solicitud real si `.env` contiene una clave y `SMARTTALKY_RUN_PAID_TTS=true`. La ejecución advierte que puede existir costo, usa el texto fijo `hello`, valida un WAV y elimina el directorio temporal al terminar. No se ejecuta en `npm test` ni en CI.
