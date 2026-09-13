# Operaciones

Esta guía resume cómo observar y mantener SmartTalky una vez exista un entorno
administrado. No autoriza crear infraestructura ni cuentas.

## Señales mínimas

- Salud: `GET /api/v1/health`.
- Errores: tasa por código seguro y `requestId`, sin texto del usuario.
- Latencia: p50, p95 y p99 por endpoint.
- Recursos: CPU, memoria, disco, tamaño/entradas de caché y conexiones.
- Protección: rate limit, timeouts, reintentos y rechazos de validación.
- Costo: generaciones, cache hit/miss, presupuesto consumido y alertas.

Nunca registrar claves, cabeceras de autorización, cuerpos completos, texto a
pronunciar ni audio. Los identificadores técnicos deben bastar para correlación.

## Procedimiento de incidente

1. Confirmar impacto mediante health, métricas y errores saneados.
2. Detener o limitar generaciones externas si existe riesgo de costo.
3. Conservar evidencia sin datos sensibles.
4. Aplicar rollback o desactivar la integración afectada según el runbook.
5. Verificar el recorrido gratuito y el endpoint de salud.
6. Comunicar alcance y estado por el canal aprobado.
7. Corregir, añadir una prueba de regresión y completar el análisis posterior.

## Caché y continuidad

Las cachés de audio y contenido son reconstruibles, privadas y limitadas. Antes
de limpiar o migrar, documentar objetivo, tamaño, ventana de mantenimiento y
rollback. La pérdida de caché puede aumentar costo, por lo que se debe conservar
el presupuesto y evitar una regeneración masiva.

El progreso de usuario del MVP permanece en cada dispositivo. La exportación
JSON es una herramienta del usuario, no un backup administrado del servidor.

## Cambios y mantenimiento

- Ejecutar las 13 puertas de [Pruebas](TESTING.md) antes de producción.
- Mantener dependencias mediante cambios pequeños, auditados y reversibles.
- Probar rotación de secretos sin imprimir valores.
- Revisar capacidad, presupuesto, avisos de seguridad y compatibilidad en cada
  release.
- Registrar incidentes, cambios operativos y decisiones en la continuidad.

## Operación Docker preparada

La topología aprobada en ADR-0004 usa `compose.production.yml`. Solo
`127.0.0.1:5182` se publica en el host; la API permanece en la red Docker.
Los contenedores deben aparecer `healthy` antes de recargar Nginx.

```bash
docker compose --env-file .env.production -f compose.production.yml ps
docker compose --env-file .env.production -f compose.production.yml logs --tail=100
curl --fail http://127.0.0.1:5182/api/v1/health
```

No copiar logs completos fuera del servidor sin revisar que estén saneados. El
host observado el 2026-09-13 tenía aproximadamente 6 GiB de RAM disponible y
26 GiB de disco libre. Establecer alertas antes de producción: disco por encima
de 85%, contenedor no saludable, tasa de error, p95/p99, reinicios y consumo del
presupuesto de proveedor.

Consulte [Seguridad](SECURITY.md), [Despliegue](DEPLOYMENT.md) y
[Solución de problemas](TROUBLESHOOTING.md).
