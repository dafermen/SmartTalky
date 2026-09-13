# Solución de problemas

## npm rechaza la versión de Node

Ejecute `node --version`. SmartTalky requiere Node 22.12 o posterior por Vite 8. Use una versión LTS compatible y reinstale con `npm ci`.

## npm informa scripts de instalación pendientes

Ejecute `npm approve-scripts --allow-scripts-pending --json` para inspeccionar. La base solo autoriza `esbuild@0.28.1`. No use `--all` sin revisar procedencia, versión y necesidad.

## TypeScript y typescript-eslint son incompatibles

La base usa TypeScript `6.0.3` porque `typescript-eslint 8.64.0` soporta versiones `<6.1.0`. No actualice solo TypeScript: compruebe primero los peer dependencies y ejecute toda la suite.

## La API no inicia

Revise `PORT`, `NODE_ENV` y `LOG_LEVEL`. Un error “Configuración inválida” muestra el nombre normalizado del campo, no su valor. Confirme que el puerto esté libre y entre 1–65535.

## La web no encuentra un paquete compartido

Ejecute `npm install` y después `npm run build`. El orden raíz compila `types` y `shared` antes de la web. No importe archivos internos de otro workspace; use su nombre de paquete.

## Una respuesta API devuelve error

Conserve `x-request-id` y busque el mismo ID en logs. Los mensajes 500 son deliberadamente genéricos; no añada trazas a la respuesta.

## OpenAI no está configurado

Es esperado: `OPENAI_API_KEY` vacía es válida y mantiene el proveedor simulado. Si esperaba audio real, confirme que la variable existe solo en el proceso de la API y reinícielo; nunca la copie a variables Vite o al navegador.

## OpenAI falla o responde 429

La API devuelve un error genérico y conserva el detalle fuera de la respuesta. Revise el `requestId`, conectividad, cuota y límites del proyecto OpenAI. Los estados 408, 409, 429 y 5xx admiten como máximo `TTS_MAX_RETRIES`; no aumente reintentos sin revisar costo y duplicación.

## Se escucha una voz distinta a OpenAI

Es el respaldo esperado. Después de reproducir, la UI indica “audio principal” o “voz gratuita”. SmartTalky usa Web Speech cuando el audio falta, tiene una clave simulada o falla. Las voces disponibles dependen del navegador y sistema operativo; instale una voz `en-US`, cambie la selección a automática o pruebe otro navegador.

## No aparece ninguna voz `en-US`

La lista puede cargarse unos instantes después de abrir la página. Si permanece vacía, confirme que el sistema tenga una voz de inglés estadounidense habilitada. El audio principal puede seguir funcionando. No agregue voces de otros idiomas al selector para ocultar el estado vacío.

## El progreso local desapareció o no se guarda

Confirme que el navegador permita almacenamiento local y que no esté usando un perfil efímero. SmartTalky continúa en memoria si una escritura falla, pero esa sesión no persistirá al cerrar la página. Borrar datos del sitio también elimina historial, favoritos y preferencias.

Los documentos v1 y v2 migran automáticamente a v3. JSON corrupto o una versión desconocida recupera valores predeterminados sin bloquear la práctica. Use “Exportar JSON” antes de limpiar datos cuando necesite conservar una copia.

## La reproducción o exportación queda bloqueada

El audio principal tiene un límite de espera de 30 segundos; al agotarse, SmartTalky lo cancela y prueba Web Speech. Si tampoco funciona, la UI vuelve a habilitar los controles y muestra un error reintentable.

Si el navegador impide crear la descarga JSON, la pantalla conserva los datos, presenta un mensaje y permite intentarlo de nuevo. Revise permisos de descarga o use otro perfil; no borre los datos antes de confirmar que obtuvo la copia.

## La caché no reutiliza un audio

Compruebe que `storage/audio-cache` sea escribible y persistente. Cambiar texto normalizado, locale, voz, modalidad, velocidad, modelo o `speech-instructions-v1` crea otra clave deliberadamente. JSON corrupto, archivo ausente o tamaño distinto se trata como miss seguro.

## La prueba TTS manual está bloqueada

Es el comportamiento esperado. Solo si acepta una solicitud potencialmente pagada, configure temporalmente `SMARTTALKY_RUN_PAID_TTS=true` junto con `OPENAI_API_KEY` y ejecute `npm run test:tts:manual`. Restablezca la bandera a `false`; el WAV temporal se elimina automáticamente.

## El formato falla

Ejecute `npm run format` y revise el diff. Markdown está fuera del formato automático para preservar documentos educativos; sus enlaces se verifican por separado durante cierres de fase.

## Aparecen archivos `dist` o `coverage`

Son generados e ignorados. No los confirme ni edite. Bórrelos solo si necesita una reconstrucción limpia y asegúrese de apuntar a la carpeta exacta del workspace.

## La web usa declaraciones antiguas de un paquete interno

Los scripts web `predev`, `pretypecheck`, `pretest` y `prebuild` ejecutan `build:dependencies`. Si una herramienta se invoca manualmente saltándose npm, ejecute primero `npm run build:dependencies`.

## No hay navegador disponible para la revisión visual

No marque accesibilidad visual como completada. Mantenga `ST-208` en revisión, conserve axe/contraste verdes y repita orden de foco, zoom, reflow y viewports cuando el navegador conectado esté disponible.
