# Tablero operativo de tareas

## Cómo usar este documento

Estados permitidos: `PENDIENTE`, `EN_PROGRESO`, `BLOQUEADA`, `EN_REVISION`, `COMPLETADA`, `CANCELADA`. Solo puede existir una tarea `EN_PROGRESO` sin una justificación explícita. Cada fila pertenece a la fase de su sección; el texto tras el guion describe el trabajo y su justificación. “Aceptación / pruebas” contiene criterios verificables y las validaciones mínimas. “Archivos” es una previsión que se ajustará al implementar. Las tareas pendientes no tienen fecha de finalización. Toda tarea exige actualizar `CURRENT_STATUS.md` y `docs/CONTINUATION.md`; no se marca completa con validaciones fallidas.

## Fase 0 — Descubrimiento y definición

### ST-001 — Inspeccionar el repositorio y documentar su estado inicial

- **Descripción:** revisar archivos, control de versiones y documentación existente.
- **Justificación:** evita reemplazar trabajo previo y establece una línea base confiable.
- **Estado / prioridad:** `COMPLETADA` / alta.
- **Dependencias:** ninguna.
- **Aceptación:** se confirma si existe código, documentación o Git y se registra el resultado.
- **Archivos relacionados:** `README.md`, `docs/CONTINUATION.md`.
- **Pruebas requeridas:** listado recursivo y estado Git.
- **Notas:** la carpeta estaba vacía y no era repositorio Git.
- **Finalización:** 2026-07-18.

### ST-002 — Crear visión, objetivos, público y propuesta de valor

- **Descripción:** definir problema, usuarios, valor, objetivos y principios.
- **Justificación:** alinea decisiones técnicas con una necesidad educativa concreta.
- **Estado / prioridad:** `COMPLETADA` / alta.
- **Dependencias:** `ST-001`.
- **Aceptación:** visión, público, no objetivos e indicadores iniciales documentados.
- **Archivos / pruebas:** `docs/01-vision-del-proyecto.md`; revisión de secciones y enlaces.
- **Notas:** interfaz inicial en español y aprendizaje `en-US`.
- **Finalización:** 2026-07-18.

### ST-003 — Definir alcance del MVP y funcionalidades futuras

- **Descripción:** separar explícitamente MVP y horizonte futuro.
- **Justificación:** previene complejidad y costo prematuros.
- **Estado / prioridad:** `COMPLETADA` / alta.
- **Dependencias:** `ST-002`.
- **Aceptación:** inclusiones, exclusiones y futuro aparecen sin contradicciones.
- **Archivos / pruebas:** `docs/02-alcance-y-requisitos.md`, `docs/ROADMAP.md`; revisión cruzada.
- **Notas:** iOS precede a Android; tiendas requieren autorización.
- **Finalización:** 2026-07-18.

### ST-004 — Definir requisitos funcionales y no funcionales

- **Descripción:** convertir el recorrido en requisitos identificables y verificables.
- **Justificación:** permite diseñar criterios y pruebas antes del código.
- **Estado / prioridad:** `COMPLETADA` / alta.
- **Dependencias:** `ST-003`.
- **Aceptación:** tablas `RF` y `RNF` cubren flujo, calidad, seguridad, costos, accesibilidad e i18n.
- **Archivos / pruebas:** `docs/02-alcance-y-requisitos.md`; revisión de trazabilidad con visión.
- **Notas:** los valores configurables exactos se deciden en tareas de implementación.
- **Finalización:** 2026-07-18.

### ST-005 — Definir términos del dominio y glosario bilingüe técnico

- **Descripción:** acordar vocabulario español e identificadores ingleses.
- **Justificación:** reduce ambigüedad educativa y técnica.
- **Estado / prioridad:** `COMPLETADA` / media.
- **Dependencias:** `ST-004`.
- **Aceptación:** incluye modalidades, TTS, caché, idiomas, contratos y arquitectura.
- **Archivos / pruebas:** `docs/16-glosario.md`; revisión de términos usados en los documentos.
- **Notas:** ampliar cuando el dominio incorpore conceptos reales.
- **Finalización:** 2026-07-18.

### ST-006 — Identificar riesgos técnicos, lingüísticos, financieros y de privacidad

- **Descripción:** crear una matriz de riesgos y mitigaciones iniciales.
- **Justificación:** TTS combina contenido educativo, datos del usuario y consumo pagado.
- **Estado / prioridad:** `COMPLETADA` / alta.
- **Dependencias:** `ST-004`.
- **Aceptación:** las cuatro categorías y riesgos operativos tienen mitigación.
- **Archivos / pruebas:** `docs/02-alcance-y-requisitos.md`, `docs/08-seguridad.md`; revisión cruzada.
- **Notas:** presupuesto y despliegue requieren decisiones posteriores.
- **Finalización:** 2026-07-18.

### ST-007 — Crear roadmap, tablero y continuidad

- **Descripción:** registrar fases, tareas, relevo y arquitectura inicial.
- **Justificación:** permite continuar sin depender del historial de conversación.
- **Estado / prioridad:** `COMPLETADA` / alta.
- **Dependencias:** `ST-002` a `ST-006`.
- **Aceptación:** fases 0–8 y futuro registrados; tareas tienen estado/dependencias/aceptación; continuidad y ADR existen.
- **Archivos / pruebas:** `docs/ROADMAP.md`, `docs/TASKS.md`, `docs/CONTINUATION.md`, `docs/adr/0001-arquitectura-inicial.md`; comprobación de enlaces, IDs y estado único.
- **Notas:** no avanzar a Fase 1 sin confirmación.
- **Finalización:** 2026-07-18.

## Fase 1 — Fundación del repositorio

| ID | Título, descripción y justificación | Estado | Prioridad / dependencias | Aceptación / pruebas | Archivos previstos |
|---|---|---|---|---|---|
| ST-101 | Configurar monorepo y workspaces — da una raíz reproducible a web, API y paquetes. | `COMPLETADA` | alta / ST-007 + confirmación | Completada 2026-07-18: npm reconoce seis workspaces; instalación, listado y scripts raíz verificados sin dependencias externas. | `package.json`, `package-lock.json`, `apps/`, `packages/`, `storage/`, `scripts/` |
| ST-102 | Inicializar React + TypeScript + Vite — crea la superficie web mínima. | `COMPLETADA` | alta / ST-101 | Completada 2026-07-18: página mínima en español; typecheck y build verdes; servidor Vite respondió HTTP 200. | `apps/web/`, `package.json`, `package-lock.json` |
| ST-103 | Inicializar Node.js + Express + TypeScript — crea la API mínima sin reglas prematuras. | `COMPLETADA` | alta / ST-101 | Completada 2026-07-18: proceso configurable inicia/cierra; typecheck/build verdes; smoke HTTP 404 esperado sin rutas. | `apps/api/`, `package-lock.json` |
| ST-104 | Crear paquetes compartidos — evita duplicación real de tipos/configuración. | `COMPLETADA` | media / ST-102, ST-103 | Completada 2026-07-18: config/tipos/valores tienen responsabilidades separadas; import real web y build/typecheck verdes. | `packages/`, apps `tsconfig`, manifiestos |
| ST-105 | Configurar TS estricto, ESLint, Prettier y EditorConfig — automatiza consistencia. | `COMPLETADA` | alta / ST-104 | Completada 2026-07-18: TS 6 compatible, ESLint/Prettier/EditorConfig compartidos; lint/formato/tipos/build verdes. | configs raíz, `.editorconfig`, manifiestos |
| ST-106 | Configurar Vitest, RTL y Supertest — habilita cambios verificables. | `COMPLETADA` | alta / ST-102, ST-103 | Completada 2026-07-18: Vitest/RTL/jsdom/Supertest configurados; una prueba web y una API verdes sin red. | configs y tests web/API |
| ST-107 | Crear entorno tipado y `.env.example` — falla con claridad sin filtrar secretos. | `COMPLETADA` | alta / ST-103 | Completada 2026-07-18: Zod valida entorno/defaults; clave opcional; 4 pruebas y `.env.example` sin secretos. | API config, `.env.example`, `.gitignore` |
| ST-108 | Crear errores, logs y salud — establece observabilidad segura. | `COMPLETADA` | alta / ST-103, ST-107 | Completada 2026-07-18: errores JSON/IDs/logs redactados/salud; 3 archivos y 7 pruebas API verdes. | dominio, HTTP y observabilidad API |
| ST-109 | Crear GitHub Actions — protege lint, tipos, pruebas y build. | `COMPLETADA` | media / ST-105, ST-106 | Completada 2026-07-18: CI Node 22/24 con npm ci, formato, lint, tipos, pruebas y build; réplica local verde. | `.github/workflows/ci.yml` |
| ST-110 | Completar instalación, comandos y estructura — permite onboarding reproducible. | `COMPLETADA` | alta / ST-101–109 | Completada 2026-07-18: instalación/comandos/estructura/diagnóstico verificados; enlaces y suite integral verdes. | README, contributing y docs 03, 06, 09, 12–15 |

## Fase 2 — Sistema visual y experiencia base

| ID | Título, descripción y justificación | Estado | Prioridad / dependencias | Aceptación / pruebas | Archivos previstos |
|---|---|---|---|---|---|
| ST-201 | Definir tokens visuales — centraliza color, tipografía, espacio, radios y sombras. | `COMPLETADA` | alta / ST-110 | Completada 2026-07-18: tokens semánticos y 7 pares de contraste ≥4.5:1 documentados; build verde. | web styles, doc 04 |
| ST-202 | Configurar Tailwind y UI fundamental — crea controles consistentes y táctiles. | `COMPLETADA` | alta / ST-201 | Completada 2026-07-18: Tailwind 4 + Button/Card/TextField en UI; 2 pruebas accesibles y suite verde. | `apps/web`, `packages/ui` |
| ST-203 | Implementar layout y navegación — da estructura responsive sin multiplicar vistas. | `COMPLETADA` | alta / ST-202 | Completada 2026-07-18: layout, skip-link, rutas práctica/acerca/404 y prueba de navegación verdes. | web layout/routes |
| ST-204 | Diseñar inicio con entrada — materializa la acción principal. | `COMPLETADA` | alta / ST-203 | Completada 2026-07-18: RHF+Zod, ayuda/errores/foco y consulta simulada probados. | feature de práctica |
| ST-205 | Crear tarjeta educativa — presenta IPA/sílabas/acento/datos ausentes. | `COMPLETADA` | alta / ST-202, ST-204 | Completada 2026-07-18: IPA/sílabas/acento/traducción/ejemplo y ausencias seguras probados. | feature/componentes |
| ST-206 | Crear controles natural/lento/profesor — hace explícitas las modalidades. | `COMPLETADA` | alta / ST-205 | Completada 2026-07-18: tres modos accesibles, limitación honesta y bloqueo concurrente probados. | feature/componentes |
| ST-207 | Implementar estados de UI — evita incertidumbre durante el recorrido. | `COMPLETADA` | alta / ST-204–206 | Completada 2026-07-18: vacío/carga/reproducción/éxito/error implementados y anunciables. | feature práctica |
| ST-208 | Accesibilidad inicial — asegura teclado, foco, contraste y movimiento reducido. | `COMPLETADA` | alta / ST-207 | Completada 2026-07-18: Axe sin violaciones, contraste ≥4.5:1 y revisión real en 320×568, 768×1024 y 1440×900; flujo, foco visible, reflow y consola verificados. | web + doc 04 |
| ST-209 | Configurar i18n en español — evita texto visible incrustado y prepara expansión. | `COMPLETADA` | alta / ST-203 | Completada 2026-07-18: UI desde claves es; cuatro conceptos lingüísticos separados y probados. | web i18n |
| ST-210 | Documentar diseño/componentes/traducciones — permite cambios seguros por juniors. | `COMPLETADA` | media / ST-201–209 | Completada 2026-07-18: tokens/componentes/estados/i18n y extensión documentados; enlaces revisados. | docs 04, 12, README |

## Fase 3 — Dominio de pronunciación y API

| ID | Título, descripción y justificación | Estado | Prioridad / dependencias | Aceptación / pruebas | Archivos previstos |
|---|---|---|---|---|---|
| ST-301 | Modelar pronunciación y metadatos — crea lenguaje de dominio estable. | `COMPLETADA` | alta / ST-210 | Completada 2026-07-18: contratos estrictos para palabra/frase, entrada educativa, modalidades, solicitud/respuesta y audio; pruebas de tipos válidos e inválidos verdes. | packages/types + web |
| ST-302 | Crear esquemas Zod compartidos — valida el contrato en ambos extremos. | `COMPLETADA` | alta / ST-301 | Completada 2026-07-18: esquemas estrictos de solicitud/respuesta y objetos anidados; 10 casos válidos/inválidos verdes y tipos alineados. | packages/shared |
| ST-303 | Normalización segura — produce identidad consistente sin alterar significado. | `COMPLETADA` | alta / ST-302 | Completada 2026-07-18: NFC y separadores Unicode normalizados sin cambiar caso/puntuación ni ocultar controles; 10 casos parametrizados verdes. | packages/shared |
| ST-304 | Límites de texto — protege costo y experiencia de frases cortas. | `COMPLETADA` | alta / ST-303 | Completada 2026-07-18: máximo configurable de 120 puntos de código, normalización previa y rechazo C0/DEL/C1; 16 casos límite verdes. | packages/shared + docs |
| ST-305 | Endpoint de solicitud — expone el caso de uso con proveedor falso. | `COMPLETADA` | alta / ST-301–304 | Completada 2026-07-18: POST tipado, normalización, proveedor falso inyectable y errores 400/500 seguros; 8 pruebas nuevas sin red. | API pronunciation feature |
| ST-306 | Endpoint controlado de audio — evita publicar almacenamiento completo. | `COMPLETADA` | alta / ST-305 | Completada 2026-07-18: GET por clave opaca, repositorio falso, MIME/tamaño/nosniff y 404 uniforme; 9 pruebas nuevas de seguridad. | API audio feature |
| ST-307 | OpenAPI/Swagger — hace verificable el contrato externo. | `COMPLETADA` | media / ST-305, ST-306 | Completada 2026-07-18: OpenAPI 3.1 publicado con rutas/esquemas/ejemplos; referencias, operationId y compatibilidad Zod probados. | API OpenAPI + doc 06 |
| ST-308 | Conectar web con TanStack Query — centraliza estado del servidor. | `COMPLETADA` | alta / ST-305, ST-207 | Completada 2026-07-18: mutation/API client tipados, proxy configurable, cancelación y reintento; 5 pruebas nuevas y flujo navegador–API verificado. | web data/feature |
| ST-309 | Consolidar pruebas de dominio/API/contrato — reduce regresiones antes de OpenAI. | `COMPLETADA` | alta / ST-301–308 | Completada 2026-07-18: matriz crítica, regla web/API única y suite integral verde sin red; 80 pruebas runtime + tipos. | tests web/API/packages + doc 14 |
| ST-310 | Documentar flujo para juniors — explica dónde extender sin acoplar. | `COMPLETADA` | media / ST-309 | Completada 2026-07-18: flujo/capas/archivos, ejemplos y extensión de endpoint/modalidad documentados según código probado. | docs 03, 05, 06, 12 |

## Fase 4 — OpenAI TTS y caché persistente

| ID | Título, descripción y justificación | Estado | Prioridad / dependencias | Aceptación / pruebas | Archivos previstos |
|---|---|---|---|---|---|
| ST-401 | Definir `TextToSpeechProvider` — desacopla dominio y proveedor pagado. | `COMPLETADA` | alta / ST-310 | Completada 2026-07-18: puerto neutral con solicitud, cancelación, bytes, metadatos y errores tipados; fake determinista y 6 pruebas verdes sin red. | API dominio/puertos |
| ST-402 | Adaptador OpenAI TTS — integra el SDK solo en infraestructura. | `COMPLETADA` | alta / ST-401 | Completada 2026-07-18: SDK 6.48.0 aislado, clave opcional, snapshot/voz configurables, WAV validado y errores seguros; 7 pruebas con mocks, sin red ni costo. | API infraestructura |
| ST-403 | Prompts versionados por modo — hace cambios pedagógicos invalidables. | `COMPLETADA` | alta / ST-401 | Completada 2026-07-18: perfiles inmutables para natural/lento/profesor, versión explícita, instrucciones y velocidad enviadas al SDK; 7 pruebas unitarias/snapshot verdes. | API TTS config |
| ST-404 | Hash determinista — identifica compatibilidad completa. | `COMPLETADA` | alta / ST-301, ST-403 | Completada 2026-07-18: serialización canónica versionada y SHA-256 opaco; texto, locale, voz, modo, velocidad, modelo y versión alteran la clave; 10 pruebas/vectores verdes. | dominio caché |
| ST-405 | Repositorio local de audio/metadatos — persiste detrás de una interfaz. | `COMPLETADA` | alta / ST-404 | Completada 2026-07-18: puerto de caché y repositorio local con claves SHA-256, validación integral y directorio controlado; 5 pruebas con temporales verdes. | API infraestructura, storage gitkeep |
| ST-406 | Hit, miss e invalidación — prioriza reutilización y seguridad. | `COMPLETADA` | alta / ST-405 | Completada 2026-07-18: aciertos evitan proveedor, misses generan/persisten y la versión cambia la clave; 5 pruebas verdes. | caso de uso/tests |
| ST-407 | Deduplicar concurrencia — evita cobros/generaciones simultáneos. | `COMPLETADA` | alta / ST-406 | Completada 2026-07-18: registro por clave comparte promesas y se limpia en éxito/fallo; 8 solicitudes producen una llamada y 2 pruebas verdes. | caso de uso |
| ST-408 | Escritura temporal/publicación segura — impide servir audio parcial. | `COMPLETADA` | alta / ST-405–407 | Completada 2026-07-18: audio y JSON temporales, metadatos publicados al final y limpieza tras fallo; fault test verde. | repositorio local |
| ST-409 | Timeouts, errores, reintentos y rate limit — limita abuso y fallos en cascada. | `COMPLETADA` | alta / ST-402, ST-408 | Completada 2026-07-18: timeout/reintentos configurables, clasificación recuperable y rate limit 429 seguro; pruebas con reloj/SDK falsos verdes. | API infraestructura/middleware |
| ST-410 | Métricas de uso/caché — permite operar costo sin datos sensibles. | `COMPLETADA` | media / ST-406, ST-409 | Completada 2026-07-18: contadores tipados hit/miss/generación/error sin etiquetas, integrados al caso de uso; pruebas verdes sin texto/secreto. | API observabilidad |
| ST-411 | Prueba manual opcional — valida el proveedor real sin afectar CI. | `COMPLETADA` | media / ST-402–410 | Completada 2026-07-18: script bloqueado por doble opt-in, aviso de costo y limpieza automática; 3 guard tests verdes, llamada real no ejecutada. | script/test manual |
| ST-412 | Documentar configuración/costos/seguridad — hace operable la integración. | `COMPLETADA` | alta / ST-401–411 | Completada 2026-07-18: composición opcional, setup, seguridad, presupuesto pendiente, limpieza, despliegue y diagnóstico documentados; suite integral y smoke sin clave verdes. | docs 07–10, 15 |

## Fase 5 — Respaldo gratuito y progreso local

| ID | Título, descripción y justificación | Estado | Prioridad / dependencias | Aceptación / pruebas | Archivos previstos |
|---|---|---|---|---|---|
| ST-501 | Adaptador Web Speech — encapsula diferencias del navegador. | `COMPLETADA` | alta / ST-412 | Completada 2026-07-18: soporte, voces, cancelación y errores tipados; 5 fake browser tests verdes. | web speech adapter |
| ST-502 | Activar respaldo — mantiene utilidad si OpenAI falta/falla. | `COMPLETADA` | alta / ST-501 | Completada 2026-07-18: audio principal con respaldo Web Speech explícito, recuperación y errores reintentables; 7 pruebas de servicio/UI verdes. | web pronunciation feature |
| ST-503 | Seleccionar voz `en-US` — respeta capacidades del dispositivo. | `COMPLETADA` | media / ST-501 | Completada 2026-07-18: lista reactiva en-US, estado vacío, selección y descarte seguro; 3 pruebas de componente verdes. | web settings |
| ST-504 | Historial local — conserva consultas sin cuentas. | `COMPLETADA` | alta / ST-502 | Completada 2026-07-18: añade, normaliza, deduplica y limita 20 consultas; 3 storage tests e integración verdes. | web local data |
| ST-505 | Favoritos locales — permite recuperar contenido elegido. | `COMPLETADA` | alta / ST-504 | Completada 2026-07-18: toggle accesible, persistencia, deduplicación y listado; pruebas de componente/storage verdes. | web local data/UI |
| ST-506 | Preferencias locales — conserva voz, velocidad y modalidad. | `COMPLETADA` | media / ST-503–505 | Completada 2026-07-18: defaults, validación y persistencia de voz/velocidad/modalidad conectadas al reproductor; pruebas verdes. | web settings/storage |
| ST-507 | Limpieza y exportación — da control de datos al usuario. | `COMPLETADA` | alta / ST-504–506 | Completada 2026-07-18: confirmaciones, borrado selectivo/total y exportación JSON v3; pruebas de UI/store verdes. | web privacy/settings |
| ST-508 | Migraciones de almacenamiento — evita pérdida por cambios de esquema. | `COMPLETADA` | alta / ST-504–507 | Completada 2026-07-18: fixtures v1/v2 migran a v3 conservando datos; JSON corrupto/versiones desconocidas recuperan defaults. | web storage migrations |
| ST-509 | Documentar privacidad y voces — comunica límites y manejo local. | `COMPLETADA` | alta / ST-501–508 | Completada 2026-07-18: UI y docs 08/12/15 distinguen backend/OpenAI/Web Speech, datos locales y controles; suite/build y recorrido real verdes. | docs 08, 12, 15 |

## Fase 6 — Calidad y preparación del MVP web

| ID | Título, descripción y justificación | Estado | Prioridad / dependencias | Aceptación / pruebas | Archivos previstos |
|---|---|---|---|---|---|
| ST-601 | Revisar cobertura crítica — cierra huecos por riesgo, no por porcentaje. | `COMPLETADA` | alta / ST-509 | Completada 2026-07-18: baseline web 88,18%/API 96,59%; matriz por riesgo y huecos de audio HTML/storage bloqueado cubiertos con 4 pruebas nuevas. | tests + doc 14 |
| ST-602 | Auditoría de accesibilidad — garantiza uso inclusivo del flujo. | `COMPLETADA` | alta / ST-601 | Completada 2026-07-18: Axe verde en inicio/guía/privacidad/404; landmarks, nombres, foco del skip-link y destino principal verificados manualmente sin fallos críticos. | web + reporte docs |
| ST-603 | Revisar responsive — valida móvil, tableta y escritorio. | `COMPLETADA` | alta / ST-601 | Completada 2026-07-18: flujo expandido verificado en 320×568, 768×1024 y 1440×900 sin overflow horizontal ni correcciones pendientes. | web + checklist |
| ST-604 | Revisar seguridad — verifica secretos, límites y rutas de audio. | `COMPLETADA` | alta / ST-601 | Completada 2026-07-18: 0 vulnerabilidades prod; headers defensivos y 400/413 seguros añadidos; 16 pruebas negativas verdes sin hallazgos críticos. | API/config/docs |
| ST-605 | Optimizar rendimiento — reduce carga sin complejidad especulativa. | `COMPLETADA` | media / ST-603 | Completada 2026-07-18: rutas Acerca/404 diferidas; candidata final bajó JS inicial 439,39→381,27 kB y gzip 135,76→116,12 kB (−14,5%). | web/API |
| ST-606 | Completar errores/recuperación — evita callejones sin salida. | `COMPLETADA` | alta / ST-602–605 | Completada 2026-07-18: red/proveedor/audio/storage recuperables; timeout audio 30 s y exportación reintentable añadidos; 19 pruebas verdes. | web/API |
| ST-607 | Preparar demo — ofrece recorrido reproducible sin gasto obligatorio. | `COMPLETADA` | media / ST-606 | Completada 2026-07-18: `demo:check` verifica salud/comfortable/audio en puerto efímero; guion y recuperación documentados sin secretos ni costo. | fixtures/docs |
| ST-608 | Completar README/changelog/guía — prepara entrega mantenible. | `COMPLETADA` | alta / ST-607 | Completada 2026-07-18: README/changelog/guía/demo/checklist actualizados; `docs:check` verificó 28 Markdown sin enlaces locales rotos. | documentación raíz/docs |
| ST-609 | Crear candidata MVP web — fija un artefacto verificable. | `COMPLETADA` | alta / ST-601–608 | Completada 2026-07-18: `0.1.0-rc.1`; release:check, 183 pruebas runtime, builds, bundle/docs/demo y recorrido real verdes; no publicada. | package metadata/changelog |
| ST-610 | Diferenciar modalidades del respaldo gratuito — hace audibles las promesas de Natural, Lenta y Profesor. | `COMPLETADA` | alta / ST-609 | Completada 2026-07-25: Lenta usa 60% del ritmo; Profesor reproduce natural, sílabas lentas y natural; 57 pruebas web verifican botones y secuencias. | reproductor web/pruebas/docs |
| ST-611 | Acentuar modalidad Lenta con OpenAI — alinea el audio principal con el ritmo pedagógico del respaldo. | `COMPLETADA` | alta / ST-610 | Completada 2026-07-25: OpenAI usa velocidad 0.6 en Lenta; la identidad invalida solo esa modalidad y conserva Natural/Profesor. | perfiles TTS/pruebas/docs |
| ST-612 | Hacer determinista la segmentación de Profesor — evita depender de una interpretación libre del proveedor. | `COMPLETADA` | alta / ST-611 | Completada 2026-07-25: el backend construye palabra, sílabas separadas y palabra; Profesor usa instrucciones v2 propias sin invalidar Natural/Lenta; 93 pruebas API verdes. | proveedor de pronunciación/perfiles TTS/pruebas/docs |
| ST-613 | Renovar experiencia visual — enfoca la práctica, aclara modalidades y da una identidad más cálida sin alterar el recorrido. | `EN_REVISION` | alta / ST-612 + pausa Android autorizada | Implementado 2026-07-25: paleta cálida, ejemplos rápidos, recorrido en tres pasos, resultado protagonista, modos como tarjetas y controles secundarios plegables; release integral y 64 pruebas web verdes. Falta aceptación visual del propietario. | web/UI/pruebas/docs |
| ST-614 | Crear símbolo de marca y favicon — hace reconocible SmartTalky en la interfaz y la pestaña sin depender de texto pequeño. | `EN_REVISION` | media / ST-613 | Implementado 2026-07-25: globo de conversación y onda de voz vectoriales aplicados al encabezado, favicon, color del navegador y título; lint, tipos, 64 pruebas web, build y revisión de secretos verdes. Falta aceptación visual del propietario. | web/public/layout/docs |
| ST-615 | Publicar centro temporal de documentación — permite a revisores entender, aprobar y mantener el proyecto desde la propia aplicación. | `EN_REVISION` | alta / ST-614 | Implementado 2026-07-25: 30 documentos en seis categorías, búsqueda, lector Markdown seguro, guía junior, guía GitHub e interruptor de retirada; 71 pruebas web y `release:check` integral verdes. Falta aceptación visual del propietario. | web/docs/scripts/pruebas |
| ST-616 | Generar y cachear contenido educativo real — permite que cualquier palabra o frase tenga IPA, sílabas, acento, traducción y ejemplo sin repetir consumo externo. | `COMPLETADA` | alta / ST-615 aprobado para continuar | Completada 2026-07-25: Responses API estructurada, Zod, caché SHA-256 atómica, deduplicación y fallback; API 23 archivos/107 pruebas, tipos y build verdes sin red ni costo. | API/shared/config/docs/pruebas |
| ST-617 | Crear corpus de calidad lingüística — detecta regresiones educativas antes de que lleguen al usuario. | `COMPLETADA` | alta / ST-616 | Completada 2026-07-25: corpus JSON de 60 casos, cobertura de diez riesgos, 3 invariantes gratuitas y protocolo humano; API 24 archivos/110 pruebas verdes. | fixtures/scripts/pruebas/docs |
| ST-618 | Pulir el recorrido de práctica — facilita repetir, copiar y recuperar contenido sin cuentas. | `COMPLETADA` | media / ST-617 | Completada 2026-07-25: nueva práctica con foco, copia accesible, filtro local, contador v4 migrable y secuencia Profesor; 22 archivos/77 pruebas web verdes. | web/progreso/i18n/pruebas/docs |
| ST-619 | Optimizar la carga web — reduce espera inicial sin degradar la experiencia. | `COMPLETADA` | media / ST-618 | Completada 2026-07-25: paneles de práctica/historial/preferencias diferidos, producción separada del `.env` backend y presupuesto automático; JS principal 572,75→382,07 kB y carga inicial 138,9 KiB gzip. | web/Vite/scripts/pruebas/docs |
| ST-620 | Limitar almacenamiento y gasto operativo — evita crecimiento indefinido y consumo accidental del proveedor. | `COMPLETADA` | alta / ST-619 | Completada 2026-07-25: LRU por acceso con topes configurables, presupuesto horario compartido antes del proveedor y alerta local sin texto; 25 archivos/115 pruebas API verdes. | API/cache/config/docs/pruebas |
| ST-621 | Fortalecer continuidad entre sesiones — evita que otra sesión trabaje desde estados históricos obsoletos. | `COMPLETADA` | alta / ST-620 | Completada 2026-07-26: `CURRENT_STATUS.md` canónico, protocolo obligatorio en `AGENTS.md`, enlaces principales y `continuity:check` integrado al release. | raíz/scripts/docs/pruebas |
| ST-622 | Estandarizar documentación y puerta previa al despliegue — facilita evaluación, mantenimiento y evita publicar sin evidencia de calidad suficiente. | `COMPLETADA` | alta / ST-621 | Completada 2026-07-28: ocho entradas estándar enlazadas a las guías existentes, 13 puertas legibles por automatización, modo estricto con 6/13 completas, 626 paquetes/versiones inventariados, plantillas/CI ampliadas y `release:check` verde con 229 pruebas y 41 documentos. | raíz/`.github`/docs/scripts/web/pruebas |
| ST-623 | Migrar el puerto web local a 5180 — fija una única dirección reproducible y evita depender de argumentos manuales al iniciar Vite. | `COMPLETADA` | media / ST-622 | Completada 2026-07-29: desarrollo/preview fijados a `127.0.0.1:5180` con puerto estricto, referencias canónicas y bundle Android sincronizados; `release:check` y verificadores móviles verdes; web/documentación/API respondieron 200 y el puerto anterior quedó cerrado. | web/config/documentación/pruebas/Android |
| ST-624 | Ajustar el ritmo interno de Lenta a 0.75 — acerca la pronunciación lenta a tres cuartos de la velocidad base sin añadir controles ni cambios visuales. | `COMPLETADA` | media / ST-623 | Completada 2026-07-29: OpenAI y Web Speech usan 0.75; interfaz intacta; 29 pruebas TTS/caché y 9 del reproductor focalizadas, más 229 pruebas de `release:check`, quedaron verdes. La velocidad forma parte de la identidad y solo crea nuevas claves lentas. | API/web/pruebas/documentación |
| ST-625 | Estandarizar la navegación del centro documental — facilita evaluación y mantenimiento sin sustituir React ni duplicar las fuentes Markdown existentes. | `COMPLETADA` | alta / ST-615 + ST-622 | Completada 2026-08-01: `/docs` es canónica y `/documentacion` redirige; encabezado, regreso a la app, buscador, navegación agrupada, tema, tabla de contenido y anterior/siguiente funcionan en escritorio y móvil; 84 pruebas web, build y Chrome 150 verdes. | web/documentación/pruebas |
| ST-626 | Restaurar la jerarquía documental canónica — corrige movimientos accidentales sin duplicar fuentes ni perder la separación entre política y guía técnica. | `COMPLETADA` | alta / ST-625 | Completada 2026-09-09: se retiraron tres duplicados de `docs/`, se restauró la guía técnica `docs/SECURITY.md` y quedaron verdes estructura, 41 enlaces Markdown, publicación de 39 fuentes y continuidad. | raíz/docs/scripts/pruebas |
| ST-627 | Incorporar una línea base reproducible de mutation testing — mide si las pruebas detectan cambios incorrectos en normalización y contratos críticos sin usar red ni proveedores pagos. | `COMPLETADA` | alta / ST-626 | Completada 2026-09-09: Stryker 10 detectó 72 de 73 mutantes (98,63%), dejó visible un equivalente, fijó umbral 98%, guardó informe JSON y añadió CI; 46 pruebas shared y `release:check` quedaron verdes. | configuración/scripts/shared/pruebas/docs |
| ST-628 | Ampliar mutation testing al backend crítico — mide identidad de caché, presupuesto, CORS, rate limit y errores seguros sin ejecutar proveedores externos. | `COMPLETADA` | alta / ST-627 | Completada 2026-09-09: 178 mutantes API alcanzaron 97,75% con umbral 97%; junto con 98,63% shared, CI y predeploy verifican 251 mutantes. Se añadieron 20 pruebas API y `release:check` quedó verde con 265 pruebas runtime. | configuración/API/pruebas/docs |
| ST-629 | Añadir fuzzing determinista de entradas y caché — somete Unicode, JSON, claves y metadatos a corpus reproducibles sin red ni datos reales. | `COMPLETADA` | alta / ST-628 | Completada 2026-09-09: semilla 0x5eedc0de reproduce más de 3.200 casos Unicode/JSON/claves/caché; cinco invariantes, typecheck y `release:check` quedaron verdes con 270 pruebas runtime. La puerta 5 quedó completa. | API/fuzzing/scripts/pruebas/docs |
| ST-630 | Resolver avisos actuales de dependencias — actualiza React Router y qs dentro de rangos compatibles, sin forzar downgrades ni cambiar arquitectura. | `COMPLETADA` | alta / ST-629 | Completada 2026-09-09: React Router 7.18.3 y qs 6.16.0 dejaron `npm audit --omit=dev` en cero; `release:check` quedó verde con 270 pruebas y 735 registros de terceros. Cinco avisos moderados permanecen solo en herramientas de desarrollo. | manifiestos/lockfile/pruebas/docs |
| ST-631 | Preparar evidencia visual, repositorio y despliegue seguro — incorpora capturas reales, reconcilia GitHub y documenta la infraestructura autorizada sin publicar mientras una puerta obligatoria permanezca incompleta. | `COMPLETADA` | alta / ST-630 | Completada 2026-09-13: cuatro capturas reales, 8 E2E, prueba de 1.000 solicitudes, Docker/Nginx/Certbot, licencia MIT y remoto GitHub preparados. Build/smoke Docker, `release:check`, auditoría de secretos y producción sin vulnerabilidades quedaron verdes; la puerta estricta bloqueó correctamente en 8/13 y no se desplegó. | README/docs/imágenes/scripts/configuración de despliegue/Git |
| ST-632 | Hacer reproducible CI desde un checkout limpio — construye los paquetes internos requeridos antes del typecheck y mutation testing para evitar depender de artefactos locales ignorados. | `EN_PROGRESO` | alta / ST-631 | CI remoto debe quedar verde en Node 22/24, mutation testing y Docker; réplica local limpia, continuidad y ausencia de llamadas OpenAI verificadas. | scripts raíz/CI/documentación |

## Fase 7 — Capacitor e iOS

| ID | Título, descripción y justificación | Estado | Prioridad / dependencias | Aceptación / pruebas | Archivos previstos |
|---|---|---|---|---|---|
| ST-701 | Evaluar brechas Capacitor — evita integrar móvil a ciegas. | `COMPLETADA` | alta / ST-609 | Completada 2026-07-18: matriz de red/audio/storage/navegación, límites y decisiones registrados en doc 11 y ADR-0002. | doc 11/ADR si aplica |
| ST-702 | Instalar/configurar Capacitor — crea puente móvil controlado. | `COMPLETADA` | alta / ST-701 | Completada 2026-07-18: Capacitor 8.4.2 configurado; `mobile:build` y `mobile:check` verifican el bundle y sus requisitos. | config Capacitor |
| ST-703 | Crear proyecto iOS — habilita Xcode sin publicar. | `BLOQUEADA` | alta / ST-702 | Proyecto generado/sincronizado, verificación estructural verde y workflow `macos-26` sin firma preparados el 2026-07-18; falta ejecutar una compilación Xcode real. | `ios/` |
| ST-704 | Configurar navegación/audio/permisos/storage — adapta funciones web. | `PENDIENTE` | alta / ST-703 | Recorrido principal opera y permisos mínimos; device tests. | web/iOS config |
| ST-705 | Probar backend seguro — valida orígenes, HTTPS y errores móviles. | `PENDIENTE` | alta / ST-704 | Entornos configurables sin secretos empaquetados; integration test. | config/docs |
| ST-706 | Verificar dispositivos/simuladores — detecta diferencias reales. | `PENDIENTE` | alta / ST-705 | Matriz iPhone/iPad soportada y resultados documentados. | checklist/tests |
| ST-707 | Documentar compilación/firma — hace reproducible preparación de tienda. | `PENDIENTE` | media / ST-706 | Guía sin credenciales y build verificado por propietario/entorno. | doc 11 |
| ST-708 | Checklist privacidad/publicación — evita envío prematuro o incompleto. | `PENDIENTE` | alta / ST-707 | Checklist completo; publicación sigue bloqueada hasta autorización. | docs/checklist |

## Fase 8 — Capacitor y Android

| ID | Título, descripción y justificación | Estado | Prioridad / dependencias | Aceptación / pruebas | Archivos previstos |
|---|---|---|---|---|---|
| ST-801 | Crear proyecto Android — habilita Android Studio sin publicar. | `COMPLETADA` | alta / ST-702 + excepción ADR-0003 | Completada 2026-07-25: proyecto Android generado/sincronizado, APK Debug compilado e instalado en un Samsung S24. | `android/` |
| ST-802 | Configurar audio/red/permisos/storage — conserva funciones con permisos mínimos. | `COMPLETADA` | alta / ST-801 | Completada 2026-07-25: consulta, guía, audios Natural/Lenta/Profesor, caché backend, historial tras reinicio, rutas hash y botón Atrás verificados en el S24; CORS explícito y HTTP solo en Debug. | web/API/Android config |
| ST-803 | Verificar tamaños/densidades — mantiene interfaz legible y táctil. | `COMPLETADA` | alta / ST-802 | Completada 2026-07-25: Samsung S24 en 1080×2340/densidad 480 vertical y horizontal, más perfil compacto temporal 720×1280/densidad 320; inicio, formulario y navegación permanecieron accesibles, y el dispositivo fue restaurado. | UI/checklist |
| ST-804 | Probar dispositivos/emuladores — descubre diferencias de plataforma. | `COMPLETADA` | alta / ST-803 | Completada 2026-07-25: además del S24/API 36, Pixel 6 virtual Android 15/API 35 verificó APK, consulta, guía, navegación Atrás, responsive y favorito persistente mediante puente ADB; OpenAI permaneció apagado. | tests/docs |
| ST-805 | Documentar compilación/firma — prepara entrega reproducible sin secretos. | `COMPLETADA` | media / ST-804 | Completada 2026-07-25: flujo Gradle reproducible, APK Debug con firma RSA/v2 verificada y procedimiento Release/Play App Signing sin credenciales versionadas. | doc 11 |
| ST-806 | Checklist privacidad/publicación — evita publicar sin revisión. | `COMPLETADA` | alta / ST-805 | Completada 2026-07-25: checklist técnico y de decisiones, declaración de datos coherente y bloqueo explícito de AAB/Google Play hasta autorización. | docs/checklist |

## Funcionalidades futuras registradas

PostgreSQL/cuentas; sincronización; micrófono y evaluación por palabra/sílaba/fonema; planes de estudio; inglés británico; nuevas interfaces; suscripciones; administración; almacenamiento de objetos/CDN; notificaciones; analítica de aprendizaje privada. No tienen tareas ejecutables hasta que el propietario cambie el alcance.
