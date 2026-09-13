# ADR-0002: Contenedor móvil con Capacitor

- **Estado:** aceptada para la Fase 7
- **Fecha:** 2026-07-18
- **Decisores:** propietario de SmartTalky y equipo de desarrollo

## Contexto

La candidata web `0.1.0-rc.1` está estable y la siguiente fase requiere preparar iOS sin duplicar la aplicación ni exponer la integración de OpenAI. La web usa rutas relativas para su API, `BrowserRouter`, audio HTML, Web Speech y `localStorage`; no todos esos supuestos se trasladan directamente a un WebView instalado.

## Decisión

Se usará Capacitor 8 como contenedor fino alrededor de los archivos construidos por `apps/web`.

- La aplicación cargará archivos locales incluidos en el binario.
- La URL pública de la API será configuración no secreta de build; en móvil deberá usar HTTPS.
- La API seguirá siendo la única responsable de claves, proveedores, caché y límites.
- La navegación usará historial hash solo en el contenedor nativo.
- El MVP conservará `localStorage` y su exportación/importación; no se añadirá sincronización.
- No se instalarán plugins ni permisos sensibles sin una necesidad demostrada.
- iOS se completará antes de iniciar Android.
- Ningún build se publicará sin autorización explícita del propietario.

El identificador inicial será `com.smarttalky.app`. Se considera provisional hasta que el propietario confirme la identidad de tienda, pero permite generar un proyecto reproducible ahora.

## Alternativas consideradas

### Cargar la web desplegada dentro de la app

Reduciría sincronizaciones, pero hace que el binario dependa completamente del despliegue remoto y amplía la superficie de navegación. Se rechaza para el MVP.

### Reescribir en una interfaz nativa

Podría ofrecer integración profunda, pero duplica producto, pruebas y accesibilidad sin una necesidad validada. Se rechaza.

### Añadir plugins de almacenamiento y archivos desde el inicio

Pueden ser útiles más adelante, pero el producto ya tiene almacenamiento local y respaldo manual. Se posponen hasta que una prueba en dispositivo demuestre una brecha.

## Consecuencias

La mayor parte del código y las pruebas se reutiliza. El frontend necesita resolver URLs absolutas y elegir historial según plataforma; el backend necesita CORS de lista explícita. La validación final de iOS, privacidad y firma depende de macOS, Xcode y dispositivos reales.

## Criterios de revisión

Revisar esta decisión si Web Speech o la exportación no funcionan de manera aceptable en dispositivos soportados, si Apple exige una capacidad no contemplada, si se agrega autenticación o si el producto necesita sincronización entre dispositivos.
