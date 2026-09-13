# ADR-0004 — Docker Compose detrás de Nginx para producción

## Estado

Aceptada para preparación el 2026-09-13. El despliegue público continúa
bloqueado por las puertas obligatorias incompletas.

## Contexto

El servidor autorizado usa Ubuntu 24.04, Docker Compose y Nginx para otros
servicios. Los puertos 5180 y 5181 ya pertenecen a otra aplicación, mientras
5182 está libre y puede enlazarse solo a loopback. SmartTalky necesita una web
estática, una API Node y cachés persistentes que no deben publicarse como
archivos.

## Decisión

Usar dos contenedores:

- `web`: Nginx sin privilegios sirve el build y reenvía `/api` dentro de una
  red Docker privada;
- `api`: Node ejecuta Express como usuario no root y monta únicamente las dos
  cachés persistentes.

El Nginx del host termina TLS para `smarttalky.innovalogic.tech` y reenvía al
puerto `127.0.0.1:5182`. La API no publica puertos del host. Los secretos viven
en `.env.production` solo en el servidor.

## Consecuencias

- El despliegue es reproducible y aislado del resto de aplicaciones.
- Se evita el conflicto con el puerto local de desarrollo 5180.
- Deben respaldarse las cachés si se decide que son operativamente valiosas.
- Dos proxies controlados requieren `TRUST_PROXY_HOPS=2`.
- Antes de activar el sitio se debe emitir el certificado correcto, probar
  rollback y completar `npm run predeploy:check`.
