# Capacitor: iOS y Android

Capacitor se incorpora después de la candidata web `0.1.0-rc.1`. El plan original era completar iOS y luego Android. El propietario autorizó adelantar Android en Windows mientras iOS continúa bloqueado por macOS/Xcode, según [ADR-0003](adr/0003-adelantar-android.md). Esta guía conserva el límite del MVP: empaquetar la experiencia existente, sin cuentas, micrófono, evaluación automática ni publicación en tiendas.

La decisión técnica está registrada en [ADR-0002](adr/0002-capacitor-ios.md). No se publicará en App Store ni Google Play sin autorización explícita del propietario.

## Evaluación de brechas

| Área | Estado web | Brecha en una app instalada | Decisión del MVP | Verificación |
|---|---|---|---|---|
| Red y API | La web usa rutas `/api` atendidas por el proxy o por el mismo origen. | Los archivos empaquetados no comparten origen con el backend desplegado. | Usar una URL base pública configurable, exigir HTTPS fuera del desarrollo local y habilitar CORS únicamente para orígenes permitidos. | Pruebas unitarias de URL/CORS e integración contra un backend configurado. |
| Audio | El audio principal se obtiene de la API y Web Speech actúa como respaldo. | La URL relativa no alcanza el backend y las voces de `WKWebView` pueden variar. | Construir también la URL de audio desde la base configurada; mantener Web Speech como respaldo sin añadir permisos de micrófono. | Prueba del adaptador y recorrido en simulador/dispositivo. |
| Almacenamiento | Progreso, favoritos y preferencias usan `localStorage`, con exportación e importación. | El almacenamiento del WebView es local al dispositivo y no se sincroniza; el sistema puede purgar datos en casos extremos. | Conservar `localStorage` para el MVP porque no hay cuentas y ya existe copia de seguridad manual. No solicitar acceso a archivos ni incorporar un plugin nativo todavía. | Persistencia tras reinicio, exportación e importación en dispositivo. |
| Navegación | `BrowserRouter` usa rutas limpias en un servidor con fallback. | Una ruta profunda empaquetada puede depender del esquema/origen del WebView. | Seleccionar automáticamente historial hash cuando Capacitor sea nativo y conservar historial del navegador en la web. | Rutas inicio, acerca, atrás/adelante y recarga. |
| Permisos | No se solicitan permisos del sistema. | Plugins o descripciones innecesarias aumentan el alcance de privacidad. | Mantener cero permisos sensibles: reproducción, Web Speech de salida, red y almacenamiento interno no requieren micrófono, cámara, ubicación ni contactos. | Revisar `Info.plist`, manifiesto de privacidad y diálogo real. |
| Ciclo de vida | React conserva estado en memoria y progreso persistente. | iOS puede suspender o terminar la app. | No ejecutar tareas en segundo plano; todas las acciones importantes persisten al completarse. | Suspender, reanudar y terminar durante un recorrido. |
| Seguridad | La clave de OpenAI vive solo en la API. | Cualquier variable incluida por Vite queda visible en el paquete. | Empaquetar únicamente la URL pública del backend; nunca claves, encabezados privados ni credenciales de firma. | Inspección automática del bundle y configuración nativa. |
| Descargas | Exportación usa un archivo JSON descargable. | La descarga mediante enlace puede comportarse distinto en `WKWebView`. | Probar el flujo actual primero; si falla, adaptar con una hoja de compartir en una tarea posterior y no pedir acceso general a archivos. | Exportar, conservar e importar el JSON en un iPhone/iPad. |

## Identidad y configuración inicial

- Nombre visible: `SmartTalky`.
- Identificador provisional: `com.smarttalky.app`. Debe confirmarse antes de firma o publicación; cambiarlo después de publicar crearía una aplicación distinta.
- Directorio web: `apps/web/dist`.
- Contenido: archivos web incluidos en el binario, no una web remota.
- Versiones objetivo iniciales: Capacitor 8 e iOS 15 o posterior, sujetos a la matriz oficial de soporte al preparar el build.

## Límites de esta estación Windows

Aquí se pueden instalar dependencias, generar archivos, construir la web y comprobar que Capacitor la copie. Xcode, el simulador de iOS, la firma, el archivo de distribución y las pruebas en iPhone/iPad requieren una Mac compatible. Esos resultados deben registrarse como pendientes hasta ejecutarlos de verdad; no se inferirán a partir de una compilación web.

## Proyecto iOS generado

El proyecto se encuentra en `ios/App/App.xcodeproj` y usa Swift Package Manager. La sincronización local confirmó:

- identificador `com.smarttalky.app`;
- destino mínimo iOS 15;
- versión visible `0.1.0` y build `1`;
- Capacitor iOS `8.4.2` fijado en `Package.swift`;
- bundle web copiado exactamente;
- ninguna descripción de permiso sensible en `Info.plist`.

Desde la raíz, el flujo reproducible es:

```powershell
npm install
npm run mobile:sync:ios
npm run mobile:check:ios
```

## Verificación necesaria en una Mac

Para cerrar `ST-703`, una Mac debe tener Node 22+, Xcode 26+ y su herramienta de línea de comandos seleccionada. No hace falta una cuenta pagada para compilar en un simulador.

```bash
npm ci
npm run mobile:sync:ios
npm run mobile:check:ios
xcodebuild -project ios/App/App.xcodeproj \
  -scheme App \
  -sdk iphonesimulator \
  -configuration Debug \
  CODE_SIGNING_ALLOWED=NO \
  build
```

Se debe registrar la versión exacta de Xcode, el destino elegido y el resultado completo. Solo después de una compilación verde se continúa con `ST-704`.

## Compilación automatizada preparada

`.github/workflows/ios.yml` replica la verificación anterior en un runner `macos-26`, registra las versiones reales de macOS/Xcode, sincroniza el bundle y ejecuta `xcodebuild` sin firma. Se activa manualmente o cuando un pull request cambia archivos móviles.

El workflow existe localmente, pero todavía no constituye evidencia de compilación: el proyecto no tiene remoto ni commit por decisión del propietario. Cuando se habilite GitHub, una ejecución verde del job **Xcode sin firma** permitirá completar `ST-703`. Una ejecución fallida debe conservar sus logs y corregirse antes de iniciar `ST-704`.

## Proyecto Android generado

El proyecto se encuentra en `android/` y se abre directamente con Android Studio. La verificación local confirmó:

- identificador `com.smarttalky.app`;
- versión visible `0.1.0` y código de versión `1`;
- SDK mínimo 24 y SDK objetivo 36;
- Capacitor Android `8.4.2`;
- bundle web incluido en el APK;
- permiso de Internet como único permiso declarado por SmartTalky;
- tráfico HTTP local habilitado únicamente en la variante Debug.

Desde la raíz, el flujo reproducible para preparar el proyecto es:

```powershell
npm install
npm run mobile:sync:android
npm run mobile:check:android
npm run mobile:open:android
```

## Desarrollo con un teléfono Android conectado

La aplicación instalada usa una URL absoluta para la API. En un teléfono conectado por USB, el build especial de dispositivo apunta a `http://127.0.0.1:3000` y `adb reverse` enlaza ese puerto con el laptop:

```powershell
npm run mobile:sync:android:device
npm run mobile:prepare:android:device
```

Después se puede ejecutar desde Android Studio o instalar el APK Debug con Gradle. La API debe estar escuchando en el puerto 3000. El enlace ADB debe prepararse otra vez cuando se desconecta/reconecta el teléfono o se reinicia ADB.

Esta excepción HTTP existe solo para Debug. Un build distribuible debe usar una URL `https://` real mediante `VITE_SMARTTALKY_API_URL`; no debe depender de ADB, localhost ni tráfico sin cifrar.

La API acepta únicamente los orígenes configurados en `CORS_ALLOWED_ORIGINS`. El WebView de Capacitor usa `https://localhost`, por lo que el valor de desarrollo incluye:

```dotenv
CORS_ALLOWED_ORIGINS=http://localhost,https://localhost
```

No se empaqueta `OPENAI_API_KEY`: la clave permanece exclusivamente en la API.

## Evidencia Android del 2026-07-25

Dispositivo probado: Samsung S24 (`SM-S721B`), Android 16/API 36, resolución 1080×2340 y densidad 480, conectado por USB.

- APK Debug compilado e instalado correctamente.
- Consulta `hello` produjo guía educativa sin error.
- Natural, Lenta y Profesor reprodujeron el audio principal de SmartTalky.
- El historial local sobrevivió a detener y volver a abrir la aplicación.
- La ruta Acerca de abrió correctamente.
- El botón físico Atrás regresó desde Acerca de a la práctica sin cerrar la aplicación.
- La aplicación no solicitó micrófono, cámara, ubicación, contactos ni acceso general a archivos.

La interfaz también se verificó en horizontal y con un perfil compacto temporal de 720×1280/densidad 320; inicio, formulario y navegación permanecieron disponibles. Después se restauraron la resolución física y la densidad 480 del teléfono.

La segunda versión se verificó en un Pixel 6 virtual, Android 15/API 35, 1080×2400:

- imagen oficial `system-images;android-35;google_apis;x86_64`;
- APK Debug compilado e instalado;
- consulta `hello` y guía educativa correctas con OpenAI desactivado;
- navegación a Acerca de y regreso mediante historial;
- favorito `hello` conservado después de recargar el WebView;
- interfaz legible, controles táctiles contenidos y sin errores fatales en Logcat;
- puente `adb reverse tcp:3000 tcp:3000`, conservando la API enlazada solo a loopback.

La voz OpenAI no se invocó en esta prueba para evitar consumo automático. La reproducción real de las tres modalidades ya estaba verificada en el S24. La combinación de ambas evidencias completa `ST-801`–`ST-804`.

## Compilación y firma Android

El APK de desarrollo se genera y firma automáticamente con la identidad Debug local:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
npm run mobile:sync:android:device
Push-Location android
.\gradlew.bat assembleDebug
Pop-Location
```

El artefacto queda en `android/app/build/outputs/apk/debug/app-debug.apk`. La verificación local con Build Tools 36 confirmó un firmante RSA de 2048 bits y APK Signature Scheme v2:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\36.0.0\apksigner.bat" `
  verify --verbose --print-certs `
  android\app\build\outputs\apk\debug\app-debug.apk
```

La firma Debug solo prueba integridad e instalación; no sirve para Google Play. Para un Release:

1. Confirmar primero el identificador definitivo `com.smarttalky.app`.
2. Crear la clave de subida fuera del repositorio y respaldarla en un gestor seguro.
3. Entregar alias y contraseñas mediante propiedades locales o secretos del CI, nunca en Git.
4. Configurar `signingConfig` de Release sin valores literales.
5. Usar exclusivamente una URL pública `https://` para el backend.
6. Ejecutar `bundleRelease`, verificar el AAB y probarlo mediante un canal interno.
7. Conservar Play App Signing para la clave de firma y separar la clave de subida.

No se creó una clave Release, AAB ni publicación: esas acciones requieren las decisiones finales del propietario.

## Diagnóstico: “No pudimos preparar la guía”

En un teléfono conectado, comprobar en este orden:

1. La API responde en `http://127.0.0.1:3000/api/v1/health` desde el laptop.
2. `npm run mobile:prepare:android:device` informa un único dispositivo autorizado.
3. La compilación usada es `mobile:sync:android:device`, no el bundle de producción sin URL local.
4. La API permite `https://localhost` en `CORS_ALLOWED_ORIGINS`.
5. Después de cambiar `.env`, reiniciar la API.

El texto del error no implica que OpenAI haya fallado: también aparece cuando el WebView no puede alcanzar la API o cuando CORS rechaza su origen.
