# ADR-0001: Arquitectura inicial del MVP

- **Estado:** aceptada para planificación; confirmar al iniciar Fase 1
- **Fecha:** 2026-07-18
- **Decisores:** propietario de SmartTalky y equipo de desarrollo

## Contexto

SmartTalky necesita una web responsive que oculte credenciales de OpenAI, reutilice audio costoso y pueda evolucionar a aplicaciones Capacitor. El repositorio estaba vacío. La solución debe ser comprensible para desarrolladores junior, ejecutable sin una clave paga y preparada —sin implementar anticipadamente— para nuevos proveedores y almacenamiento.

## Decisión

Se usará un monorepo con npm workspaces:

- `apps/web`: React, TypeScript estricto, Vite, Tailwind, React Router, TanStack Query, React Hook Form, Zod e i18n.
- `apps/api`: Node.js LTS, TypeScript estricto, Express, Zod, SDK oficial de OpenAI, OpenAPI, logs estructurados y rate limiting.
- `packages/`: contratos, configuración y UI compartida solo cuando exista reutilización real.
- `storage/`: caché de audio/metadatos ignorada por Git, accedida mediante un repositorio.

El backend se separará en presentación, aplicación, dominio e infraestructura de manera pragmática. `TextToSpeechProvider` aislará OpenAI. Una interfaz de repositorio aislará el sistema de archivos. La composición de dependencias será explícita, sin contenedor de DI.

La clave de caché será un hash de una identidad canónica completa. Las generaciones concurrentes equivalentes compartirán el trabajo y los archivos se publicarán desde temporales. La web implementará respaldo Web Speech y almacenamiento local; no habrá cuentas ni PostgreSQL en el MVP.

## Alternativas consideradas

### Aplicación full-stack en un único framework

Reduce despliegues, pero mezcla decisiones de UI/API y no aporta una ventaja clara para el empaquetado Capacitor previsto. Se descarta inicialmente.

### Repositorios separados

Permiten ciclos independientes, pero aumentan coordinación y duplicación de contratos para un equipo/producto pequeño. Se descartan para el MVP.

### Llamar OpenAI desde el navegador

Expondría credenciales y debilitaría límites/caché. Se rechaza.

### PostgreSQL y almacenamiento de objetos desde el inicio

Serían útiles a escala, pero añaden costo y operación antes de validar el MVP. Se posponen detrás de interfaces.

## Consecuencias

**Positivas:** contratos cercanos, herramientas uniformes, secretos en backend, pruebas con adaptadores falsos, migración futura posible y frontend explorable sin OpenAI.

**Costos:** configuración inicial del monorepo, necesidad de coordinar versiones de contratos y operación separada de API/almacenamiento en producción.

## Criterios de revisión

Revisar este ADR si npm workspaces bloquea herramientas elegidas, si el destino de despliegue no ofrece almacenamiento persistente, si Capacitor exige cambios de origen/red o si aparecen varios equipos con ciclos de release independientes. Toda sustitución requiere un ADR nuevo; no se edita el historial de esta decisión.
