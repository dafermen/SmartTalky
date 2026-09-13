# API

Esta es la entrada estándar para consumidores y mantenedores de la API. El
contrato explicado con ejemplos está en [la guía detallada](06-api.md); la
especificación ejecutable se sirve en `GET /api/v1/openapi.json`.

## Base y endpoints

En desarrollo la API usa `http://127.0.0.1:3000`. En un entorno público debe
estar detrás de HTTPS y nunca debe exponer una clave de proveedor.

| Método | Ruta | Resultado |
|---|---|---|
| `GET` | `/api/v1/health` | Estado mínimo del servicio. |
| `GET` | `/api/v1/openapi.json` | Contrato OpenAPI 3.1. |
| `POST` | `/api/v1/pronunciations` | Guía educativa y metadatos de audio. |
| `GET` | `/api/v1/audio/:key` | Audio validado por clave opaca. |

## Compatibilidad

- Locale actual: `en-US`.
- Modos: `natural`, `slow` y `teacher`.
- Longitud máxima: 120 puntos de código después de normalización.
- Contratos: TypeScript + Zod + OpenAPI.
- Errores: código estable, mensaje seguro y `requestId`.

Un cambio incompatible exige una nueva versión de ruta o una estrategia de
migración documentada. Antes de integrar cambios de contrato deben pasar las
pruebas de tipos, Zod y OpenAPI descritas en [Pruebas](TESTING.md).

## Seguridad y costo

La API aplica validación estricta, tamaño máximo, tipos MIME permitidos, rate
limit, timeout, reintentos acotados y presupuesto de generaciones. El audio se
entrega por un endpoint controlado; `storage/` no es público. Consulte
[Seguridad](SECURITY.md) y [Operaciones](OPERATIONS.md).
