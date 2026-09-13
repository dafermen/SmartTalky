# ADR-0003: Adelantar Android mientras iOS está bloqueado

- **Estado:** aceptada
- **Fecha:** 2026-07-25
- **Decisores:** propietario de SmartTalky y equipo de desarrollo

## Contexto

El plan inicial exigía completar iOS antes de iniciar Android. La estación disponible usa Windows, tiene Android Studio y un Samsung S24 conectado, pero no dispone de macOS ni Xcode. `ST-703` continúa bloqueada por esa dependencia externa, mientras la mayor parte de la integración Capacitor es compartida.

## Decisión

El propietario autorizó avanzar Android hasta el límite verificable en el entorno disponible, sin considerar completada ni sustituida la cadena iOS.

- Android parte de la configuración compartida completada en `ST-702`.
- Las tareas Android avanzan en su propio orden `ST-801` a `ST-806`.
- iOS conserva sus estados, criterios y bloqueo de Xcode.
- No se firma ni publica ninguna plataforma sin autorización explícita.
- Las decisiones finales de identificador, tienda, firma y privacidad se posponen hasta el cierre del proyecto.

## Consecuencias

Se obtiene evidencia real temprana sobre WebView, red, audio, almacenamiento y navegación en Android. El trabajo compartido puede reducir riesgos futuros de iOS, pero una prueba Android no se presenta como evidencia de iPhone/iPad. El roadmap y el tablero deben mostrar ambas cadenas por separado.
