# Arquitectura

Este documento es la entrada estándar a la arquitectura de SmartTalky. La
descripción detallada y las decisiones históricas se conservan en
[arquitectura del proyecto](03-arquitectura.md) y en [ADR](adr/).

## Vista general

```text
Navegador o aplicación Android
             |
             | HTTPS / JSON / audio por clave opaca
             v
apps/web  <----->  apps/api  <----->  proveedor OpenAI opcional
   |                  |
   |                  +-----> storage local privado y limitado
   v
packages/ui, packages/shared, packages/types, packages/config
```

- `apps/web`: React, Vite y Capacitor. Renderiza la experiencia, conserva
  progreso no sensible en el dispositivo y nunca recibe una clave de proveedor.
- `apps/api`: Express. Valida, limita y coordina contenido educativo, audio,
  caché, presupuesto y proveedores externos.
- `packages/types`: contratos TypeScript sin comportamiento de ejecución.
- `packages/shared`: esquemas Zod, normalización y utilidades compartidas.
- `packages/ui`: componentes visuales reutilizables.
- `packages/config`: configuración técnica común.

## Reglas que no deben romperse

- Los proveedores externos permanecen detrás de puertos del backend.
- Los controladores HTTP son delgados; las reglas viven en casos de uso,
  servicios y dominio.
- El texto del usuario nunca se convierte en una ruta de archivo.
- Una generación consulta primero la caché y usa una identidad SHA-256
  determinista.
- Solicitudes simultáneas equivalentes comparten trabajo; la publicación en
  caché es atómica.
- La web vuelve a validar la respuesta antes de mostrarla.
- Ninguna prueba automática llama OpenAI ni otro servicio pagado.

## Centro documental

La documentación navegable forma parte de `apps/web`; no es una segunda
aplicación ni duplica las fuentes Markdown. `/docs` es la ruta canónica y
`/documentacion` redirige por compatibilidad. El catálogo cerrado decide qué
archivos pueden publicarse, el lector no interpreta HTML incrustado y los
enlaces internos se resuelven por identificadores estables. El buscador, la
navegación agrupada, el tema y la tabla de contenido se ejecutan localmente y
no llaman a la API ni a proveedores externos.

## Ubicación de código y pruebas

SmartTalky es un monorepo organizado por funcionalidad. Las pruebas se colocan
junto al módulo que protegen (`*.test.ts` o `*.test.tsx`) y los fixtures junto a
su dominio. Por eso no se crea una carpeta raíz `src/` o `test/`: duplicaría la
jerarquía de `apps/` y `packages/` y separaría pruebas del código que explican.

La equivalencia con una estructura convencional es:

| Estructura convencional | SmartTalky |
|---|---|
| `src/` | `apps/*/src/` y `packages/*/src/` |
| `test/unit/` | pruebas colocadas junto a funciones y componentes |
| `test/integration/` | pruebas de aplicación/rutas en `apps/api/src/` y cliente web |
| `test/contract/` | OpenAPI, Zod y pruebas de tipos en API y paquetes compartidos |
| `test/e2e/` | evidencia manual actual; suite automatizada pendiente |
| `test/fixtures/` | fixtures locales del dominio correspondiente |

## Decisiones

- [ADR-0001: arquitectura inicial](adr/0001-arquitectura-inicial.md)
- [ADR-0002: contenedor móvil con Capacitor](adr/0002-capacitor-ios.md)
- [ADR-0003: adelantar Android](adr/0003-adelantar-android.md)
- [ADR-0004: Docker Compose detrás de Nginx](adr/0004-docker-nginx-produccion.md)
- [Modelo de datos](05-modelo-de-datos.md)
- [OpenAI TTS y caché](07-openai-tts-y-cache.md)
