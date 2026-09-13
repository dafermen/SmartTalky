# API

La API de pronunciación ofrece un recorrido simulado predeterminado y activa OpenAI/caché únicamente cuando el backend recibe una clave. Su especificación OpenAPI 3.1 se publica como JSON en `GET /api/v1/openapi.json`.

## Endpoints previstos

| Método | Ruta | Propósito |
|---|---|---|
| `GET` | `/api/v1/health` | Estado mínimo sin secretos. |
| `GET` | `/api/v1/openapi.json` | Contrato OpenAPI 3.1 verificable. |
| `POST` | `/api/v1/pronunciations` | Obtener o generar una pronunciación. |
| `GET` | `/api/v1/audio/:key` | Entregar un audio validado por clave. |

## Solicitud de pronunciación

```json
{
  "locale": "en-US",
  "modes": ["natural", "slow", "teacher"],
  "text": "comfortable"
}
```

`POST /api/v1/pronunciations` normaliza y valida estrictamente el cuerpo. La respuesta contiene una entrada educativa y metadatos de audio con `key`, `mode`, `mimeType` y `byteLength`. Sin clave usa el fake determinista; con clave genera y cachea por separado el contenido educativo estructurado y cada audio. La respuesta puede incluir `exampleTranslation` junto al ejemplo en inglés.

La web llama esta ruta mediante TanStack Query y valida nuevamente la respuesta antes de mostrarla. En desarrollo usa el proxy de Vite; `SMARTTALKY_API_TARGET` permite cambiar el puerto local sin exponer una URL de proveedor en el navegador.

`GET /api/v1/audio/:key` acepta únicamente claves opacas de hasta 64 caracteres con formato controlado. Resuelve la clave mediante un repositorio, limita el activo a 10 MiB, permite solamente WAV/MP3 y envía `X-Content-Type-Options: nosniff`. No existe publicación estática de `storage/`.

## Errores

Las respuestas usan una estructura consistente con código estable, mensaje seguro y `requestId`. Los detalles internos, rutas y credenciales no se exponen. Toda respuesta incluye el encabezado `x-request-id`.

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "El recurso solicitado no existe.",
    "requestId": "identificador-uuid"
  }
}
```

El health check devuelve únicamente:

```json
{
  "status": "ok",
  "service": "smarttalky-api"
}
```

Zod valida solicitudes y respuestas mediante `@smarttalky/shared`. El máximo de texto es 120 puntos de código; se rechazan controles C0, DEL y C1.

Los ejemplos de OpenAPI se analizan con los esquemas Zod reales durante las pruebas. También se comprueba que todas las referencias locales resuelvan y que los `operationId` sean únicos.

## Controles

Rate limiting por IP, tamaño máximo de 10 MiB, timeout, reintentos acotados, tipos MIME permitidos y validación estricta. La carpeta completa de almacenamiento no se publica como contenido estático. Al superar el límite se devuelve `429 RATE_LIMIT_EXCEEDED` con `Retry-After`.
