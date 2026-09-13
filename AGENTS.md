# Reglas operativas de SmartTalky

Este archivo rige el trabajo de cualquier agente dentro de todo el repositorio.

## Antes de modificar el proyecto

1. Leer `CURRENT_STATUS.md` completo: es la fotografía autoritativa de reanudación.
2. Leer `README.md`, `docs/ROADMAP.md`, `docs/TASKS.md` y el final de `docs/CONTINUATION.md`.
3. Ejecutar `npm run continuity:check`.
4. Revisar el estado del repositorio y conservar cambios que no pertenezcan a la tarea actual.
5. Elegir la única tarea `EN_PROGRESO` o la primera `PENDIENTE` cuyas dependencias estén completas.
6. No iniciar una fase mientras los entregables de la anterior estén incompletos.
7. Si los documentos se contradicen, detener la implementación y reconciliarlos con evidencia del código y las pruebas.

## Durante el trabajo

- Mantener como máximo una tarea `EN_PROGRESO`, salvo justificación escrita en `docs/TASKS.md`.
- Hacer incrementos pequeños, verificables y coherentes.
- Escribir identificadores técnicos en inglés; interfaz, documentación y comentarios educativos en español.
- Usar TypeScript estricto y evitar `any` salvo justificación documentada.
- Añadir o actualizar pruebas y documentación junto con cada funcionalidad.
- Mantener OpenAI y cualquier proveedor externo detrás de interfaces del backend.
- Nunca exponer ni registrar secretos, encabezados de autorización o texto sensible innecesario.
- No llamar servicios pagos desde pruebas automáticas ni sin autorización/configuración explícita.
- No implementar elementos fuera del MVP: deben registrarse en el roadmap.
- Distinguir `release:check` (candidata local) de `predeploy:check` (puerta
  estricta de producción). Nunca desplegar a producción pública si alguna de
  las 13 familias obligatorias de `docs/TESTING.md` está incompleta. Un staging
  restringido puede crearse, con autorización explícita y CI verde, únicamente
  para reunir la evidencia pendiente; no debe recibir tráfico general ni usar
  proveedores pagos durante pruebas automáticas.

## Antes de terminar una sesión

1. Ejecutar las validaciones proporcionales al cambio.
2. Verificar los criterios de aceptación antes de marcar una tarea `COMPLETADA`.
3. Actualizar `CHANGELOG.md` cuando exista y el cambio sea relevante.
4. Actualizar siempre `docs/CONTINUATION.md` con cambios, pruebas, decisiones, riesgos y siguiente paso.
5. Actualizar siempre `CURRENT_STATUS.md` si cambió fase, estado, validación, servicio, riesgo o siguiente paso.
6. Ejecutar `npm run continuity:check`.
7. Si cambiaron dependencias, regenerar y verificar
   `THIRD_PARTY_LICENSES.md`.
8. Dejar el repositorio estable y sin archivos generados o secretos.

## Reglas de arquitectura

- Monorepo con npm workspaces, salvo ADR posterior que justifique otra decisión.
- Aplicaciones en `apps/web` y `apps/api`; contratos reutilizables en `packages/`.
- Código organizado por dominio o funcionalidad, no por grandes carpetas genéricas.
- Controladores HTTP delgados; reglas de negocio en servicios/casos de uso.
- Inyección de dependencias explícita y sencilla.
- Audio servido por endpoints controlados; el texto del usuario nunca forma rutas de archivo.
- Cachear antes de generar, usar claves criptográficas deterministas, escritura temporal y exclusión de solicitudes simultáneas duplicadas.

## Documentación de continuidad

`CURRENT_STATUS.md` es la fotografía breve y actual. `docs/TASKS.md` es la fuente operativa e histórica del trabajo. `docs/CONTINUATION.md` es el diario de relevo entre sesiones. Los tres deben coincidir en fase, tarea activa, bloqueos, última validación y siguiente paso. Si el código contradice la documentación, se debe investigar y corregir ambos; no se debe asumir silenciosamente que uno de ellos es correcto.
