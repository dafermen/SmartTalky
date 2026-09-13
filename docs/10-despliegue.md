# Despliegue

La secuencia estándar, la separación local/staging/producción y la puerta
estricta están en [Despliegue](DEPLOYMENT.md). Ningún procedimiento de este
documento sustituye las [13 familias previas](TESTING.md) ni autoriza publicar.

El servidor autorizado es Ubuntu 24.04 con Docker Compose y Nginx. El dominio
es `smarttalky.innovalogic.tech`. Se eligió Docker Compose detrás del Nginx
del host porque esa misma infraestructura ya opera otros servicios y permite
aislar web, API y cachés; véase
[ADR-0004](adr/0004-docker-nginx-produccion.md).

La arquitectura separa web estática, API Node y almacenamiento persistente de
audio. `compose.production.yml` publica únicamente la web en
`127.0.0.1:5182`; 5180 y 5181 ya pertenecen a otra aplicación del servidor.
La API queda accesible solo dentro de la red Docker.

El volumen de `storage/audio-cache` debe sobrevivir reinicios y no puede publicarse estáticamente. Solo la ruta controlada de audio debe leerlo. Si existen varias instancias, el registro de promesas en memoria no deduplica entre procesos; antes de escalar se requiere bloqueo distribuido o almacenamiento con operación condicional.

Antes de desplegar se decidirán HTTPS, CORS, proxy/IP confiable, backups, límite/retención de caché, exportación de métricas, rollback, presupuesto mensual y alertas. La clave se configura en el gestor de secretos, nunca en la imagen o bundle web. No se crean recursos externos ni se publica automáticamente.

## Preparación reproducible

```bash
cp .env.production.example .env.production
# Edite .env.production únicamente en el servidor y proteja sus permisos.
docker compose --env-file .env.production -f compose.production.yml config
docker compose --env-file .env.production -f compose.production.yml build
```

La configuración del Nginx del host está en
`deploy/nginx/smarttalky.innovalogic.tech.conf`. Antes de habilitarla debe
existir un certificado cuyo SAN incluya exactamente el subdominio. El
certificado que hoy entrega el host corresponde a otro dominio, por lo que
HTTPS todavía es un bloqueo real y no debe ignorarse.

El staging restringido puede prepararse después de `release:check`, CI verde y
autorización explícita para ejecutar las pruebas que aún faltan. No equivale a
producción, no debe quedar abierto al tráfico general y no usa llamadas pagadas
automáticas. El despliegue público solo puede continuar cuando `npm run predeploy:check`
termine en 13/13. En ese momento, la secuencia documentada de backup, inicio,
smoke y rollback de [DEPLOYMENT.md](DEPLOYMENT.md) sigue siendo obligatoria.

El centro de documentación existe para la revisión académica o técnica. Antes de una distribución pública final se debe decidir si continúa visible. Para ocultarlo sin borrar las fuentes, use `VITE_SHOW_DOCUMENTATION=false` durante el build y confirme que ni el menú, la ruta canónica `/docs` ni la redirección heredada `/documentacion` quedan disponibles.
