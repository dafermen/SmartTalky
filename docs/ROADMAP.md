# Roadmap de SmartTalky

El avance es secuencial. Una fase comienza cuando los entregables verificables de la anterior están completos. Las fechas se decidirán según capacidad y evidencia; este documento no promete fechas artificiales.

## Fase 0 — Descubrimiento y definición

**Objetivo:** establecer el contrato funcional y técnico.  
**Estado:** completada y confirmada por el propietario el 2026-07-18.  
**Tareas:** `ST-001` inspección inicial; `ST-002` visión; `ST-003` alcance; `ST-004` requisitos; `ST-005` glosario; `ST-006` riesgos; `ST-007` roadmap, tareas y continuidad.  
**Entregables:** documentación base y ADR inicial, sin integración real con OpenAI.

## Fase 1 — Fundación del repositorio

**Objetivo:** crear una base profesional, ejecutable y verificable.  
**Estado:** completada el 2026-07-18; diez tareas verificadas y suite integral verde.  
**Tareas:** `ST-101` monorepo/workspaces; `ST-102` React/Vite; `ST-103` Express; `ST-104` paquetes compartidos; `ST-105` TypeScript/ESLint/Prettier/EditorConfig; `ST-106` pruebas; `ST-107` entorno tipado; `ST-108` errores/logs/salud; `ST-109` CI; `ST-110` documentación.  
**Entregables:** web y API ejecutables, pruebas mínimas verdes y CI configurado.

## Fase 2 — Sistema visual y experiencia base

**Objetivo:** construir la interfaz mobile-first con datos simulados.  
**Estado:** completada el 2026-07-18; experiencia, accesibilidad automática y revisión visual/manual verificadas.  
**Tareas:** `ST-201` tokens; `ST-202` Tailwind/UI; `ST-203` layout; `ST-204` inicio; `ST-205` tarjeta educativa; `ST-206` controles de modalidad; `ST-207` estados; `ST-208` accesibilidad; `ST-209` i18n; `ST-210` documentación.  
**Entregables:** interfaz responsive funcional y accesible con datos simulados.

## Fase 3 — Dominio de pronunciación y API

**Objetivo:** establecer contratos y flujo web–API con TTS simulado.  
**Estado:** completada el 2026-07-18; diez tareas verificadas sin llamadas externas ni servicios pagos.  
**Tareas:** `ST-301` modelo; `ST-302` Zod; `ST-303` normalización; `ST-304` límites; `ST-305` solicitud; `ST-306` entrega de audio; `ST-307` OpenAPI; `ST-308` TanStack Query; `ST-309` pruebas; `ST-310` documentación.  
**Entregables:** recorrido completo con proveedor falso, sin consumir OpenAI.

## Fase 4 — OpenAI TTS y caché persistente

**Objetivo:** generar audio una sola vez y reutilizarlo de forma segura.  
**Estado:** completada el 2026-07-18; doce tareas verificadas, integración real opcional y ninguna llamada pagada durante pruebas automáticas.  
**Tareas:** `ST-401` interfaz TTS; `ST-402` adaptador OpenAI; `ST-403` prompts; `ST-404` hash; `ST-405` repositorio local; `ST-406` hit/miss/invalidez; `ST-407` concurrencia; `ST-408` publicación segura; `ST-409` resiliencia/rate limit; `ST-410` métricas; `ST-411` prueba manual; `ST-412` documentación.  
**Entregables:** OpenAI TTS opcional, caché segura y sin regeneración innecesaria.

## Fase 5 — Respaldo gratuito y progreso local

**Objetivo:** mantener utilidad sin proveedor y persistir actividad sin cuentas.  
**Estado:** completada el 2026-07-18; nueve tareas verificadas, sin cuentas ni llamadas pagadas.  
**Tareas:** `ST-501` Web Speech; `ST-502` failover; `ST-503` voz `en-US`; `ST-504` historial; `ST-505` favoritos; `ST-506` preferencias; `ST-507` limpieza/exportación; `ST-508` migraciones; `ST-509` documentación.  
**Entregables:** experiencia resiliente y progreso local administrable.

## Fase 6 — Calidad y preparación del MVP web

**Objetivo:** estabilizar una primera versión demostrable.  
**Estado:** candidata `0.1.0-rc.1` verificada y no publicada; correcciones de audio `ST-610`–`ST-612` y `ST-624`, maduración `ST-616`–`ST-621`, estructura documental/puerta de despliegue `ST-622`, puerto web local 5180 `ST-623`, navegación documental `ST-625`, restauración de jerarquía `ST-626`, mutation testing `ST-627`–`ST-628`, fuzzing `ST-629`, dependencias `ST-630`, preparación Git/Docker/evidencia `ST-631` y CI limpio `ST-632` completados; experiencia visual, marca y documentación `ST-613`–`ST-615` en revisión final del propietario.
**Tareas:** `ST-601` cobertura; `ST-602` accesibilidad; `ST-603` responsive; `ST-604` seguridad; `ST-605` rendimiento; `ST-606` recuperación; `ST-607` demo; `ST-608` documentación; `ST-609` candidata; `ST-610`–`ST-612` audio; `ST-613` experiencia visual; `ST-614` marca; `ST-615` documentación pública; `ST-616` contenido educativo; `ST-617` corpus lingüístico; `ST-618` práctica; `ST-619` rendimiento; `ST-620` operación; `ST-621` continuidad entre sesiones; `ST-622` estructura documental y 13 puertas de pruebas; `ST-623` puerto web local 5180; `ST-624` ritmo interno de Lenta 0.75; `ST-625` navegación documental estandarizada; `ST-626` restauración de jerarquía documental; `ST-627`–`ST-628` mutation testing; `ST-629` fuzzing determinista; `ST-630` dependencias seguras; `ST-631` capturas, E2E, carga, GitHub y Docker/Nginx; `ST-632` CI reproducible desde checkout limpio.
**Entregables:** candidata de release del MVP web.

## Fase 7 — Capacitor e iOS

**Objetivo:** empaquetar la web estable para iPhone/iPad.  
**Tareas:** `ST-701` evaluación; `ST-702` Capacitor; `ST-703` proyecto iOS; `ST-704` integración nativa; `ST-705` backend seguro; `ST-706` dispositivos/simuladores; `ST-707` compilación/firma; `ST-708` privacidad/publicación.  
**Entregables:** paquete iOS verificable y documentación; sin publicación automática.

**Estado 2026-07-18:** en curso; evaluación y configuración completadas. Proyecto iOS generado y sincronizado, pendiente de compilación real en macOS/Xcode antes de continuar la cadena.

## Fase 8 — Capacitor y Android

**Objetivo:** adaptar la aplicación estable a Android. El propietario autorizó adelantar esta plataforma mientras iOS continúa bloqueado por falta de macOS/Xcode; véase ADR-0003.  
**Tareas:** `ST-801` proyecto; `ST-802` integración; `ST-803` interfaz; `ST-804` pruebas; `ST-805` compilación/firma; `ST-806` privacidad/publicación.  
**Entregables:** paquete Android verificable y documentación; sin publicación automática.

**Estado 2026-07-25:** completada sin publicación. Samsung S24/API 36 y Pixel 6 virtual/API 35 verificaron el paquete; compilación, firma Debug, privacidad y checklist de Google Play están documentados. Release, firma de producción y publicación requieren decisiones y autorización.

## Horizonte posterior al MVP

Solo se registra, sin implementación: PostgreSQL y cuentas, sincronización, evaluación con micrófono y puntuación fonética, planes/listas de estudio, inglés británico, interfaz francesa y otros idiomas, suscripciones, administración, almacenamiento de objetos/CDN, notificaciones y analítica respetuosa de la privacidad.
