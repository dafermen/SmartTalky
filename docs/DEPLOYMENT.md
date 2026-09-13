# Despliegue

SmartTalky no tiene aún un entorno público. El propietario autorizó preparar
`smarttalky.innovalogic.tech` en un servidor Ubuntu 24.04 con Docker Compose,
Nginx y Certbot, pero no autorizó saltar las puertas de calidad. La guía técnica
detallada está en
[despliegue](10-despliegue.md) y el estado actual en
[`CURRENT_STATUS.md`](../CURRENT_STATUS.md).

Desde 2026-09-13 existe un staging HTTPS restringido al origen autorizado, en
el commit `c01cdc1`, con proveedor falso y caché real. No es producción pública:
la matriz permanece en 11/13 y Nginx devuelve 403 a otros orígenes.

## Entornos

| Entorno | Objetivo | Datos/proveedor |
|---|---|---|
| Local | Desarrollo y demo gratuita. | Proveedor simulado por defecto; `.env` local. |
| Staging | Verificación E2E, seguridad, capacidad y rollback. | Secretos administrados y cuota limitada; sin datos reales innecesarios. |
| Producción | Servicio público aprobado. | HTTPS, observabilidad, presupuesto y operación formal. |

## Secuencia obligatoria

1. Registrar versión/commit y decisiones de arquitectura.
2. Ejecutar `npm ci` en un entorno limpio.
3. Ejecutar `npm run release:check`, confirmar CI remoto verde y revisar
   `npm run deployment:status`.
4. Con autorización explícita, crear un staging restringido con configuración
   equivalente a producción y sin proveedor pago en pruebas automáticas.
5. Ejecutar allí E2E, seguridad, carga, compatibilidad y rollback; actualizar la
   evidencia de las puertas sin declarar como completa una prueba no realizada.
6. Ejecutar `npm run predeploy:check`; debe finalizar 13/13 antes de producción.
7. Obtener aprobación final del propietario.
8. Desplegar producción mediante el mecanismo autorizado.
9. Ejecutar health y smoke; observar errores, latencia, recursos y presupuesto.
10. Registrar resultado y activar rollback si falla un criterio.

## Condiciones que bloquean hoy

La matriz autoritativa es
[`deployment-gates.json`](deployment-gates.json). Mutation testing, fuzzing,
E2E empaquetado, carga backend y licencia ya tienen evidencia local. Aún faltan
aceptación final, seguridad pública y staging HTTPS con rollback. El certificado
que responde actualmente pertenece a otro dominio; por tanto,
`npm run predeploy:check` debe fallar para producción y no es válido ignorarlo.
Ese resultado no impide un staging restringido cuya finalidad sea reunir la
evidencia faltante, siempre que `release:check`, CI y la autorización estén
registrados.

## Topología preparada

```text
Internet
  → Nginx del host :443
    → 127.0.0.1:5182
      → contenedor web :8080
        → /api → contenedor api :3000
```

- La API no publica ningún puerto del host.
- Web y API eliminan capacidades Linux y usan raíz de solo lectura.
- La web corre como UID 101 y la API como el usuario `node`.
- Las cachés son los únicos volúmenes con escritura.
- `TRUST_PROXY_HOPS=2` solo es seguro con ambos proxies bajo control.

El alias SSH local es `ruteza-dev`; no se versionan la clave privada ni su
ruta absoluta. El puerto remoto 5182 estaba libre durante la inspección del
2026-09-13. Los puertos 5180 y 5181 pertenecen a otro producto y no deben
reutilizarse.

## Primera instalación, cuando la puerta esté verde

1. Crear `/opt/smarttalky` y copiar o clonar allí el commit aprobado.
2. Copiar `.env.production.example` como `.env.production`, asignar modo
   `600` y completar la clave únicamente en el servidor.
3. Crear `storage/audio-cache` y `storage/educational-cache` con propietario
   UID/GID 1000 para que la API no root pueda escribir.
4. Exportar `SMARTTALKY_IMAGE_TAG` con el SHA corto del commit.
5. Validar y construir:

```bash
docker compose --env-file .env.production -f compose.production.yml config
docker compose --env-file .env.production -f compose.production.yml build
docker compose --env-file .env.production -f compose.production.yml up -d --wait
```

6. Probar por loopback `/`, `/api/v1/health`, una pronunciación simulada o
   cacheada y una imagen documental.
7. Crear `/var/www/smarttalky-acme`, habilitar primero
   `deploy/nginx/smarttalky.bootstrap.conf` y recargar Nginx solo después de
   `nginx -t`.
8. Emitir el certificado:

```bash
certbot certonly --webroot -w /var/www/smarttalky-acme \
  -d smarttalky.innovalogic.tech
```

9. Para staging, crear
   `/etc/nginx/snippets/smarttalky-staging-allow.conf` con una lista `allow`
   mínima y `deny all`, habilitar `deploy/nginx/smarttalky.staging.conf`,
   repetir `nginx -t`, recargar y ejecutar smoke HTTPS desde el origen
   autorizado. La configuración sin restricción
   `smarttalky.innovalogic.tech.conf` solo corresponde a producción 13/13.

## Rollback

Conservar al menos la imagen del commit anterior. Si falla cualquier smoke:

1. restaurar `SMARTTALKY_IMAGE_TAG` al SHA anterior;
2. ejecutar `docker compose ... up -d --wait`;
3. restaurar la configuración Nginx anterior si cambió;
4. repetir health/smoke y registrar el incidente;
5. no borrar las cachés para hacer rollback.

## Artefactos

- Web: build reproducible de `apps/web`.
- API: build de `apps/api` con variables validadas y secretos fuera del bundle.
- Contenedores: targets `web` y `api` de `Dockerfile`, coordinados por
  `compose.production.yml`.
- Android: AAB Release firmado fuera del repositorio; el APK Debug no es un
  artefacto de producción.

No se publica almacenamiento local, `.env`, claves, audio cacheado, datos de
usuarios ni credenciales de firma. Consulte
[Checklist de release](18-checklist-release.md) y
[Capacitor](11-capacitor-ios-android.md).
