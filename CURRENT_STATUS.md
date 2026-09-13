# Estado actual de SmartTalky

> Última actualización: 2026-09-13. Este archivo es la fotografía breve para
> reanudar el proyecto. El tablero detallado permanece en `docs/TASKS.md` y el
> historial de sesiones en `docs/CONTINUATION.md`.

## Punto actual

SmartTalky está en una **puerta de decisiones previa a producción pública**. El
MVP web `0.1.0-rc.1` y Android están implementados. GitHub contiene `c01cdc1` y
el staging HTTPS restringido ejecuta ese commit sin OpenAI; producción pública
permanece bloqueada.

- Fases 0–5: completas.
- Fase 6: implementación completa; `ST-613`, `ST-614` y `ST-615` continúan
  `EN_REVISION` hasta la aceptación visual final del propietario.
- Fase 7/iOS: bloqueada por falta de macOS/Xcode y fuera de la prioridad actual.
- Fase 8/Android: completa, sin publicación en Google Play.
- `ST-622` está completa: documentación estándar y puerta verificable previa a
  despliegue.
- `ST-623` está completa: la web local usa 5180 de forma explícita y estricta.
- `ST-624` está completa: Lenta usa internamente 0.75 en OpenAI y Web Speech,
  sin cambios visuales.
- `ST-625` está completa: `/docs` es la ruta canónica del centro documental,
  con compatibilidad heredada, navegación responsive y tema claro/oscuro.
- `ST-626` está completa: la jerarquía documental canónica fue restaurada tras
  un movimiento accidental de archivos.
- `ST-627` está completa: Stryker verifica normalización y contratos
  compartidos con línea base 98,63%, umbral 98% e informe reproducible.
- `ST-628` está completa: mutation testing cubre el núcleo compartido y cinco
  módulos críticos del backend con umbrales automáticos de 98% y 97%.
- `ST-629` está completa: más de 3.200 entradas adversariales reproducibles
  verifican Unicode, JSON, claves y metadatos de caché.
- `ST-630` está completa: React Router 7.18.3 y `qs` 6.16.0 dejan la
  auditoría de producción en cero vulnerabilidades.
- `ST-631` está completa: cuatro capturas reales, E2E Playwright, línea base
  de carga, Docker Compose/Nginx endurecidos, remoto GitHub e inspección segura
  del servidor quedaron preparados sin publicación.
- `ST-632` está completa: typecheck y mutation testing construyen primero sus
  dependencias internas; el CI remoto quedó verde desde un checkout limpio.
- `ST-633` está completa: staging HTTPS restringido, certificado, E2E, caché,
  carga, seguridad de infraestructura, smoke y rollback quedaron verificados.

## Funcionalidad terminada

- Web React/TypeScript responsive, accesible y en español.
- Guía educativa para palabras y frases con IPA, segmentos, acento,
  traducciones y ejemplos.
- OpenAI opcional exclusivamente en el backend, con salida estructurada.
- Audio Natural, Lenta y Profesor; respaldo Web Speech cuando está disponible.
- Cachés SHA-256 de contenido y audio, deduplicación, publicación atómica y LRU.
- Límites configurables de almacenamiento, rate limit y presupuesto temporal de
  generaciones externas.
- Historial, favoritos, preferencias, exportación, borrado y contador de
  reproducciones en almacenamiento local.
- Centro temporal de documentación en `/docs`, con búsqueda, menú agrupado,
  tabla de contenido, anterior/siguiente, tema persistente y regreso a la app.
- Ocho entradas técnicas estándar, 13 puertas previas al despliegue y un
  inventario reproducible de 626 paquetes/versiones de terceros.
- Android Capacitor verificado en Samsung S24/API 36 y Pixel 6 virtual/API 35.
- APK Debug firmado y procedimiento de Release/Google Play documentado.
- Cuatro capturas reales reproducibles y publicadas dentro del lector Markdown.
- Ocho recorridos E2E sobre build real: escritorio y móvil, práctica, docs,
  imágenes y responsive, siempre con proveedor simulado.
- Docker multi-stage con web/API no privilegiadas, raíz de solo lectura, red
  privada, healthchecks y único puerto loopback `127.0.0.1:5182`.
- Runbook Nginx/Certbot para `smarttalky.innovalogic.tech`, con bootstrap,
  smoke y rollback documentados.

## Última validación conocida

`npm run release:check` quedó verde el 2026-09-13:

- formato, lint y TypeScript estricto;
- 46 pruebas shared, 84 web y 142 API: 272 pruebas runtime;
- 8 E2E Playwright en Chromium de escritorio y móvil;
- builds de workspaces;
- bundle sin secretos;
- JavaScript inicial: 445,3 KiB / 139,7 KiB gzip;
- 42 documentos sin enlaces locales rotos, 25 elementos estructurales, 40
  fuentes y 4 imágenes publicadas en el centro temporal;
- 738 combinaciones de paquete/versión con licencia declarada inventariadas;
- continuidad obligatoria y tarea activa única verificadas;
- demo simulada sin OpenAI ni costo.

La prueba de capacidad incluida obtuvo 451,3 solicitudes/segundo, p95 81,3 ms,
p99 121,6 ms y 53,9 MiB de crecimiento RSS sobre 1.000 solicitudes con
concurrencia 25. Docker Compose construyó ambas imágenes y el smoke local
confirmó web, salud, pronunciación e imagen documental HTTP 200; la API no
publicó puerto y ambos contenedores quedaron saludables.

Después del primer push, la réplica limpia de `ST-632` pasó typecheck y las dos
campañas de mutaciones desde cero. `release:check` volvió a quedar verde con
402,5 solicitudes/segundo, p95 96,2 ms, p99 131,7 ms y 54,3 MiB RSS. El trabajo
de mutaciones dispone ahora de 20 minutos para su duración real. El CI remoto
34780746302 confirmó Node 22/24, 8 E2E, Docker y mutaciones en verde.

El commit `c01cdc1` también pasó CI remoto 34782577814 y `release:check` con
272 pruebas runtime. Staging completó 10 E2E HTTPS dos veces; conservó seis
artefactos de audio/metadatos con huella idéntica y OpenAI vacío. La carga de
5.000 solicitudes obtuvo 704,4 req/s, p95 51,5 ms, p99 94,0 ms y cero fallos.
API/web alcanzaron aproximadamente 61%/28% CPU y 64/5 MiB; el host quedó en
1,9/7,9 GiB usados y disco al 75%.

La última sincronización y verificación Android permanece verde desde
2026-07-29. `ST-625` cambia únicamente la navegación web documental y no volvió
a generar el paquete Android.

Además, `npm run test:mutation` verifica 251 mutantes: shared obtuvo 98,63% y
API crítica 97,75%, ambos sobre sus umbrales. Chrome 150 verificó `/docs` a
1440×1000 y 390×844 en claro y oscuro,
sin overflow ni enlaces duplicados. No se hizo ninguna llamada pagada.

`npm audit --omit=dev` informa cero vulnerabilidades. La auditoría completa
conserva cinco avisos moderados en Vitest y dependencias de herramientas de
desarrollo, no incluidas en
producción; su corrección automática propone `--force` y permanece pendiente
de versiones compatibles.

## Puerta previa al despliegue

`npm run deployment:status` informa **11 de 13 puertas completas**. El modo
estricto fue probado y bloquea correctamente un despliegue. Permanecen
incompletas:

1. aceptación visual final;
2. aceptación formal o actualización compatible de cinco avisos moderados que
   solo afectan herramientas de desarrollo.

`npm run predeploy:check` debe fallar mientras exista cualquiera de estas
brechas. La matriz autoritativa está en `docs/deployment-gates.json`.

## Servicios locales

- Web esperada: `http://127.0.0.1:5180/`.
- Documentación esperada: `http://127.0.0.1:5180/docs`.
- API esperada: `http://127.0.0.1:3000/`.
- Salud: `http://127.0.0.1:3000/api/v1/health`.
- `.env` local puede contener la clave del propietario y está ignorado por Git.
  Nunca mostrar, copiar, registrar ni versionar su contenido.

Los procesos no son estado permanente: una nueva sesión debe comprobar los
puertos y reiniciarlos si es necesario. Iniciar la API no consume OpenAI; una
consulta nueva sí puede hacerlo cuando la clave está configurada.

## GitHub e infraestructura autorizada

- Remoto: `https://github.com/dafermen/SmartTalky.git`; `origin/main` contiene
  `c01cdc1`, con CI remoto verde.
- Servidor: Ubuntu 24.04, Docker 29.8, Compose 5.5, Nginx 1.24 y Certbot 2.9.
- DNS: `smarttalky.innovalogic.tech` resuelve al servidor autorizado.
- 5180/5181 están ocupados por otro producto; SmartTalky reserva 5182 solo en
  loopback.
- Staging sirve un certificado válido para `smarttalky.innovalogic.tech`, con
  vencimiento 2026-12-12 y renovación simulada satisfactoria.
- Solo el origen autorizado accede al staging; otro origen obtuvo HTTP 403.
- La ruta SSH local y la clave privada nunca se documentan ni versionan.

## Pendientes que requieren al propietario

1. Aceptar o solicitar cambios visuales de `ST-613`, `ST-614` y `ST-615`.
2. Aceptar formalmente el riesgo residual dev-only o solicitar esperar una
   actualización compatible; no se recomienda `npm audit fix --force`.
3. Confirmar identificador Android definitivo.
4. Aprobar política de privacidad pública.
5. Definir presupuesto mensual, cuota compartida y alertas del proveedor.
6. Proveer o autorizar credenciales de firma Release y publicación.
7. Revisar los resultados del staging autorizado y dar o negar la aprobación
   final de producción cuando las 13 puertas estén completas.

No crear cuentas, claves, releases ni publicaciones suponiendo estas
decisiones. La preparación Git/Docker ya autorizada no equivale a permiso para
habilitar el servicio público.

## Pendientes técnicos previos a producción

1. Resolver las dos decisiones pendientes de aceptación y seguridad.
2. Antes de producción, configurar el secreto OpenAI directamente en el
   servidor y desactivar `CACHED_FAKE_PROVIDER_ENABLED`, sin copiarlo al Git.

## Próximo paso recomendado

Antes de publicar:

1. obtener aceptación visual y decisión sobre el riesgo dev-only;
2. actualizar la matriz únicamente con esas decisiones explícitas;
3. repetir `npm run predeploy:check` hasta obtener 13/13;
4. configurar el proveedor real y retirar la restricción solo con aprobación de
   producción;
5. generar un AAB Release sin publicar y probarlo en el canal interno de Google
   Play solo con autorización explícita.

iOS se retoma únicamente cuando el propietario lo solicite y exista una Mac con
Xcode compatible.

## Protocolo de reanudación

Toda nueva sesión debe:

1. leer `AGENTS.md`;
2. leer este archivo;
3. revisar `docs/TASKS.md` y el final de `docs/CONTINUATION.md`;
4. ejecutar `npm run continuity:check`;
5. comprobar `git status --short` y conservar todos los cambios existentes;
6. elegir como máximo una tarea `EN_PROGRESO`;
7. actualizar este archivo y `docs/CONTINUATION.md` antes de terminar.
