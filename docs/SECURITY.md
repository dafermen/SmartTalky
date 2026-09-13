# Seguridad técnica

Esta es la entrada estándar para el modelo de seguridad. La evaluación detallada
está en [seguridad del producto](08-seguridad.md); el proceso responsable de
reporte está en la [política raíz](../SECURITY.md).

## Fronteras de confianza

- El navegador y la aplicación móvil son clientes no confiables.
- Solo el backend conoce claves de proveedor.
- Toda entrada se valida y limita en el borde y nuevamente donde se consume.
- `storage/`, `.env`, cachés, datos locales y firma no son contenido público.
- Las claves de audio son opacas y nunca se derivan de una ruta enviada por el
  usuario.

## Datos

El backend recibe la palabra o frase necesaria para producir contenido/audio.
El MVP no usa cuentas ni analítica. Historial, favoritos, preferencias y
contadores permanecen en el dispositivo. Logs y métricas no deben incluir texto,
audio, claves, autorización ni datos personales innecesarios.

## Controles existentes

- Zod, normalización Unicode y límites de cuerpo/texto.
- HTTPS obligatorio fuera del desarrollo local.
- CORS explícito, rate limit, timeout y reintentos acotados.
- MIME/tamaño controlados y `nosniff` para audio.
- Caché SHA-256, escritura atómica y deduplicación concurrente.
- Presupuesto previo al proveedor y pruebas automáticas sin costo.
- Búsqueda de patrones sensibles en el bundle web.
- Contenedores no privilegiados, sin capacidades Linux, con raíz de solo
  lectura y API sin puerto publicado.

## Proxy y TLS preparados

El Nginx del host recibe Internet, la web Nginx recibe solo loopback y la API
recibe únicamente la red Docker. Por eso producción declara exactamente dos
proxies confiables; no aumentar `TRUST_PROXY_HOPS` ni publicar el puerto 3000.
El proxy externo sobrescribe `X-Forwarded-For` con `$remote_addr` antes de
que el proxy interno lo amplíe.

El subdominio resuelve al servidor autorizado, pero el certificado observado el
2026-09-13 correspondía a otro dominio. El staging ya usa un certificado válido
de `smarttalky.innovalogic.tech`, cuya renovación simulada pasó, y permanece
restringido por IP. Esta evidencia no autoriza retirar la restricción.

## Antes de producción

Debe completarse la puerta 10 de
[`deployment-gates.json`](deployment-gates.json): análisis de dependencias,
pruebas negativas, secretos, headers, CORS, abuso, infraestructura y respuesta a
incidentes. Los avisos conocidos requieren corrección o aceptación formal,
acotada y revisable; una explicación informal no equivale a cierre.

Si una clave se expone, detener el acceso, revocarla en el proveedor, rotar las
dependencias que la consumen y revisar historial/logs. Borrar el archivo o el
último commit no invalida una credencial filtrada.

## Dependencias conocidas

Desde el 2026-09-09, `npm audit --omit=dev` informa cero vulnerabilidades de
producción con React Router 7.18.3 y `qs` 6.16.0. La auditoría completa conserva
cinco avisos moderados en Vitest/Stryker. Son herramientas de desarrollo y no se
empaquetan en web/API, pero deben revisarse cuando exista una versión compatible;
no se autoriza `npm audit fix --force` para ocultarlos mediante cambios mayores.
La puerta de seguridad permanece parcial hasta que el propietario acepte
formalmente este riesgo residual o exista una actualización compatible.

El staging confirmó además HSTS/CSP, CORS, UFW activo, acceso permitido 200 y
origen no autorizado 403, API sin puerto público, usuarios no root, raíz de solo
lectura y capacidades Linux eliminadas.
