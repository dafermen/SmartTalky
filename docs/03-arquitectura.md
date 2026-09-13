# Arquitectura

## Vista general propuesta

SmartTalky será un monorepo con dos aplicaciones desplegables y paquetes internos reutilizables:

```text
apps/web  ──HTTP──> apps/api ──> proveedor TTS
   │                    │
   │                    └──────> repositorio local de audio/metadatos
   └──> Web Speech API y almacenamiento local

packages/shared | packages/ui | packages/types | packages/config
```

La decisión y sus consecuencias se formalizan en [ADR-0001](adr/0001-arquitectura-inicial.md).

## Estado implementado al cierre de la Fase 4

La web consume contratos y validadores compartidos, gestiona la solicitud con TanStack Query y solo llama rutas `/api`. La API separa composición, HTTP, casos de uso y adaptadores falsos por funcionalidad. Pronunciación y audio tienen puertos inyectables; ningún componente web conoce almacenamiento o proveedores.

`TextToSpeechProvider` es el puerto neutral para síntesis. Recibe texto, locale, modalidad y una señal de cancelación opcional; devuelve bytes y metadatos técnicos de MIME, proveedor, modelo, voz y duración. Sus errores clasifican configuración ausente, cancelación, fallo e invalidez sin definir mensajes HTTP. El fake determinista permite probar este límite sin red.

El adaptador OpenAI vive únicamente en infraestructura y recibe un cliente SDK inyectable. La composición del proceso lo activa solo si existe `OPENAI_API_KEY`; en caso contrario conserva pronunciación y audio falsos. Con clave, `CachingPronunciationProvider` coordina identidad, caché, resiliencia y generación; `GET /audio/:key` lee el mismo repositorio local.

## Responsabilidades

### `apps/web`

Presenta la interfaz, valida tempranamente formularios, consulta la API mediante TanStack Query, reproduce audio, gestiona respaldo Web Speech y persiste progreso/preferencias locales. Nunca conoce la clave de OpenAI ni llama directamente al proveedor.

### `apps/api`

Valida configuración y solicitudes, aplica límites, coordina casos de uso, consulta la caché, invoca el proveedor TTS cuando corresponda y sirve archivos mediante rutas controladas. Los controladores traducen HTTP; no contienen reglas de negocio.

### `packages/`

- `shared`: esquemas y utilidades realmente compartidos.
- `types`: contratos de dominio/API cuando separarlos reduzca acoplamiento.
- `ui`: componentes visuales reutilizables de la web.
- `config`: configuración común de TypeScript, lint y herramientas.

`types` contiene contratos y las listas literales mínimas que los originan, como las modalidades admitidas; `shared` contiene configuración y utilidades. `ui` contiene los componentes visuales reutilizados por la web.

## Capas del backend

- Presentación: rutas, controladores, middleware y serialización de errores.
- Aplicación: casos de uso, por ejemplo obtener o generar pronunciación.
- Dominio: tipos, reglas de identidad de audio y errores tipados.
- Infraestructura: OpenAI, sistema de archivos, logs y reloj/hash inyectables cuando ayuden a probar.

No se añadirá un contenedor de inyección de dependencias; la composición explícita ocurrirá en el punto de arranque.

## Flujo principal

1. `PracticeForm` usa el esquema compartido con mensajes i18n.
2. TanStack Query llama `POST /api/v1/pronunciations` y adjunta un `AbortSignal`.
3. La ruta vuelve a validar/normalizar y entrega el contrato al caso de uso.
4. El caso de uso invoca `PronunciationProvider` y valida su respuesta.
5. Sin clave, el proveedor falso devuelve contenido educativo y claves simuladas.
6. Con clave, cada modalidad calcula SHA-256, consulta caché y comparte cualquier generación equivalente en curso.
7. Un miss invoca OpenAI detrás de timeout/reintentos, valida el resultado y publica audio/metadatos de forma atómica.
8. La web valida otra vez la respuesta antes de renderizarla.
9. `GET /api/v1/audio/:key` resuelve bytes mediante el repositorio activo, sin publicar carpetas.

## Evolución prevista

Las interfaces de repositorio permitirán migrar caché local a almacenamiento de objetos. La persistencia local de progreso podrá reemplazarse por sincronización con cuentas/PostgreSQL, pero ninguna de estas infraestructuras se implementará en el MVP.
