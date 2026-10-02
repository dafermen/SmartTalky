# Índice de documentación

Este mismo catálogo puede consultarse desde la aplicación web en `/docs`. La
ruta histórica `/documentacion` redirige allí para conservar compatibilidad.

## Entradas estándar

Estas guías ofrecen una ruta breve y convencional; enlazan la documentación
detallada existente en vez de reemplazarla.

- [Arquitectura](ARCHITECTURE.md)
- [API](API.md)
- [Desarrollo](DEVELOPMENT.md)
- [Pruebas y 13 puertas de despliegue](TESTING.md)
- [Despliegue](DEPLOYMENT.md)
- [Operaciones](OPERATIONS.md)
- [Seguridad técnica](SECURITY.md)
- [Solución de problemas](TROUBLESHOOTING.md)
- [Licencias de terceros](../THIRD_PARTY_LICENSES.md)

## Producto y alcance

- [Visión del proyecto](01-vision-del-proyecto.md)
- [Alcance y requisitos](02-alcance-y-requisitos.md)
- [Arquitectura](03-arquitectura.md)
- [Diseño visual](04-diseno-visual.md)
- [Modelo de datos](05-modelo-de-datos.md)
- [Glosario](16-glosario.md)

## Ingeniería y operación

- [API](06-api.md)
- [OpenAI TTS y caché](07-openai-tts-y-cache.md)
- [Seguridad](08-seguridad.md)
- [Instalación](09-instalacion.md)
- [Despliegue](10-despliegue.md)
- [Capacitor: iOS y Android](11-capacitor-ios-android.md)
- [Guía para desarrolladores junior](12-guia-desarrollador-junior.md)
- [Convenciones de código](13-convenciones-de-codigo.md)
- [Pruebas](14-pruebas.md)
- [Solución de problemas](15-solucion-de-problemas.md)
- [Demostración del MVP web](17-demo-mvp-web.md)
- [Checklist de candidata MVP web](18-checklist-release.md)
- [GitHub y colaboración](19-github-y-colaboracion.md)

## Planificación y decisiones

- [Estado actual para reanudar](../CURRENT_STATUS.md)
- [Roadmap](ROADMAP.md)
- [Tareas](TASKS.md)
- [Continuidad](CONTINUATION.md)
- [ADR-0001: arquitectura inicial](adr/0001-arquitectura-inicial.md)
- [ADR-0002: contenedor móvil con Capacitor](adr/0002-capacitor-ios.md)
- [ADR-0003: adelantar Android mientras iOS está bloqueado](adr/0003-adelantar-android.md)
- [ADR-0004: Docker Compose detrás de Nginx](adr/0004-docker-nginx-produccion.md)

## DOC-STD-20261002 — Fuentes canónicas

Estándar documental v1.0 · revisión 2026-10-02. Idioma principal: español.

Aplicación de pronunciación con web, API y Capacitor.

La documentación canónica usa /docs. El estado breve, TASKS y CONTINUATION cumplen funciones distintas y deben ser coherentes. El staging restringido no equivale a producción pública; preservar la aceptación pendiente y los límites del proveedor. No realizar llamadas pagadas para validar documentación.

| Necesidad | Fuente oficial |
| --- | --- |
| Presentación | [README.md](../README.md) |
| Estado vigente | [CURRENT_STATUS.md](../CURRENT_STATUS.md) |
| Desarrollo | [docs/DEVELOPMENT.md](DEVELOPMENT.md) |
| Arquitectura | [docs/ARCHITECTURE.md](ARCHITECTURE.md) |
| API / contratos | [docs/API.md](API.md) |
| Pruebas | [docs/TESTING.md](TESTING.md) |
| Seguridad | [docs/SECURITY.md](SECURITY.md) |
| Despliegue | [docs/DEPLOYMENT.md](DEPLOYMENT.md) |
| Operación | [docs/OPERATIONS.md](OPERATIONS.md) |
| Solución de problemas | [docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| Uso | [docs/17-demo-mvp-web.md](17-demo-mvp-web.md) |
| Tareas | [docs/TASKS.md](TASKS.md) |
| Historial de sesiones | [docs/CONTINUATION.md](CONTINUATION.md) |
| Móvil | [docs/11-capacitor-ios-android.md](11-capacitor-ios-android.md) |
| Historia | [CHANGELOG.md](../CHANGELOG.md) |

Para probar el producto, comenzar por presentación, estado y uso. Para desarrollar, continuar con instalación, arquitectura y pruebas. Para operar, consultar despliegue, seguridad y recuperación. El índice detallado existente conserva su validez.

### Evidencia y actualización

Separar estado vigente, historia y decisiones. Los resultados de pruebas fechados conservan su valor histórico. Este mapa no vuelve a ejecutar todos los comandos documentados ni cierra la aceptación pendiente del producto. Registrar las comprobaciones realmente ejecutadas, su entorno y sus límites antes de publicar.

Actualizar la guía de origen al cambiar comandos, configuración, comportamiento, permisos o despliegue. Mantener enlaces y rutas del portal. Usar capturas reales con datos sintéticos; nunca publicar valores de .env, claves, datos de usuarios ni logs operativos. Un commit local, un commit remoto y un artefacto desplegado son estados diferentes.
