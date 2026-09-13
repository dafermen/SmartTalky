# Seguridad

## Controles obligatorios

- Claves y secretos solo en variables del backend; `.env.example` contendrá marcadores vacíos.
- Validación de configuración con errores seguros.
- Longitud, caracteres de control, tamaño y frecuencia de solicitudes limitados.
- Texto del usuario excluido de rutas de archivos y minimizado en logs.
- Hashes y claves validados antes de acceder al almacenamiento.
- Escrituras temporales restringidas a la carpeta configurada.
- OpenAI con timeout y reintentos limitados; sin reintentar errores no recuperables.
- Errores HTTP centralizados sin trazas internas en producción.
- Dependencias y CI revisados durante la Fase 1.
- Rate limit predeterminado de 30 solicitudes por minuto e IP; el proxy de producción debe definir correctamente la IP confiable.
- Caché con claves SHA-256, esquema versionado, límite de 10 MiB y publicación de metadatos al final.
- Prueba pagada bloqueada por clave y confirmación `SMARTTALKY_RUN_PAID_TTS=true` simultáneas.
- Respuestas API con CSP restrictiva, `frame-ancestors 'none'`, `nosniff`, `DENY`, política de permisos vacía y `no-referrer`.
- JSON malformado o mayor de 32 KiB se convierte en 400/413 seguro antes de registrar detalles del parser o cuerpo.

## Privacidad

El MVP no requiere cuentas. La web guarda bajo la clave `smarttalky.local-progress` del almacenamiento local:

- las últimas 20 consultas, deduplicadas;
- favoritos elegidos por la persona;
- voz, velocidad y modalidad preferidas;
- una versión de esquema usada para migraciones recuperables.

Estos datos permanecen en el perfil del navegador donde se practicó. La pantalla de práctica permite exportarlos como JSON versionado, borrar historial o favoritos por separado y restablecer todo con confirmación. Borrar datos del navegador fuera de SmartTalky también puede eliminarlos. No se implementa analítica de aprendizaje remota.

El texto escrito se envía a la API propia al preparar una guía. Si el servidor tiene OpenAI habilitado, el backend puede enviar ese texto al proveedor para sintetizar audio; la clave y el SDK nunca se exponen en la web. Sin configuración de OpenAI, la API usa el recorrido simulado y no llama servicios pagos.

Web Speech es un respaldo gestionado por el navegador. SmartTalky no envía el texto a un endpoint adicional para activarlo, pero el navegador, sistema operativo o proveedor de voz puede procesarlo local o remotamente según su implementación y configuración. Por eso la UI no promete procesamiento exclusivamente local.

## Reporte de vulnerabilidades

Antes de publicar el repositorio se creará `SECURITY.md` con un canal privado confirmado por el propietario. No se deben abrir issues públicos que incluyan secretos o instrucciones de explotación activas.

## Riesgos pendientes

El despliegue concreto, proxy de confianza, política CORS, límites presupuestarios y retención/limpieza automática de audio dependen del entorno elegido y se resolverán antes de la release candidata.

## Auditoría de Fase 6

- Búsqueda de patrones sensibles: no hay claves ni encabezados reales; solo marcadores vacíos, documentación y fixtures explícitos.
- `.env` y variantes permanecen ignorados salvo `.env.example`; caché, logs y temporales también están fuera de Git.
- Rutas de audio conservan clave opaca, regex acotada, MIME/tamaño validados y `nosniff`.
- Pronunciación conserva límite de 120 puntos de código, cuerpo HTTP de 32 KiB y rate limit configurable.
- `npm audit --omit=dev`: 0 vulnerabilidades de producción el 2026-07-18.
- Pruebas negativas verifican JSON malformado, cuerpo excesivo, traversal, MIME/tamaño, errores redactados, rate limit y bloqueo de llamada pagada.

No quedan hallazgos críticos abiertos. CORS no se habilita en la API porque el MVP usa mismo origen/proxy; cualquier despliegue en orígenes separados requerirá una lista explícita, nunca `*` con credenciales.
