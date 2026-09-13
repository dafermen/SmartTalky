# Solución de problemas

Esta es la entrada rápida para diagnóstico. Los casos y comandos detallados
están en [la guía existente](15-solucion-de-problemas.md).

## La web no abre

1. Compruebe que el proceso web está activo y use la URL que muestra Vite.
2. Para el entorno habitual del proyecto pruebe `http://127.0.0.1:5180/`.
3. Si el puerto cambió, reinicie el workspace web y use la nueva URL mostrada.

## La guía de pronunciación falla

1. Compruebe `http://127.0.0.1:3000/api/v1/health`.
2. Confirme que `SMARTTALKY_API_TARGET` apunta a la API.
3. En Android Debug, prepare el dispositivo para el puente local antes de abrir
   la aplicación.
4. Revise el `requestId` y el código seguro; no copie claves ni cuerpos sensibles.

## El audio no suena o los modos parecen iguales

- Confirme que el navegador permite reproducción.
- Natural, Lenta y Profesor son solicitudes distintas; Lenta usa ritmo menor y
  Profesor reproduce palabra, segmentos y palabra.
- Si el audio principal falla, compruebe si el dispositivo ofrece Web Speech.
- No borre toda la caché como primer paso: identifique modo, origen y clave opaca.

## OpenAI no se activa

- La clave solo pertenece a `.env` del backend.
- Reinicie la API después de cambiar el entorno.
- Una entrada ya cacheada no genera una nueva llamada.
- Las pruebas automáticas nunca deben activar la integración pagada.

## Una validación falla

- `release:check`: corrija el fallo local antes de llamar candidata a la versión.
- `deployment:status`: es un informe y puede mostrar pendientes esperados.
- `predeploy:check`: debe fallar mientras una de las 13 puertas esté incompleta;
  no cambie el manifiesto sin evidencia.
- `docs:check`: revise la ruta relativa indicada.
- `continuity:check`: reconcilie `CURRENT_STATUS.md`, `TASKS.md` y
  `CONTINUATION.md`.

## Seguridad

No pegue `.env`, claves, autorización, audio privado ni datos personales en un
issue o captura. Si sospecha exposición, siga [Seguridad](SECURITY.md) y la
[política de reporte](../SECURITY.md).
