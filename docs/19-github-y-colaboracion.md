# GitHub y colaboración

El remoto autorizado es
[`dafermen/SmartTalky`](https://github.com/dafermen/SmartTalky). La rama
`main` remota contenía inicialmente solo la licencia MIT; el proyecto local
se enlazó conservando ese commit y sin reescribir historia. Los workflows y
plantillas están preparados, pero una validación local no debe presentarse como
una ejecución de GitHub Actions.

## Modelo mental

Git guarda versiones del proyecto en la computadora. GitHub aloja una copia remota y permite revisar cambios antes de unirlos. Una rama contiene un trabajo aislado; un commit guarda un punto coherente; un pull request solicita revisión de una rama.

```text
main
 └── codex/mejora-breve
      ├── commit de código y pruebas
      └── pull request → revisión → integración
```

## Primera actualización del código

1. Confirmar que `origin` apunta a
   `https://github.com/dafermen/SmartTalky.git`.
2. Ejecutar `npm run release:check` y revisar la puerta de despliegue.
3. Revisar `git status`, `git diff --cached` y el contenido que se publicará.
4. Crear un commit trazable sin secretos.
5. Subir sin `--force` y verificar GitHub Actions.

Nunca subir `.env`, claves, caché de audio, datos de usuarios, `node_modules`, builds locales ni credenciales de firma.

## Trabajo cotidiano

1. Actualizar `main`.
2. Elegir una tarea disponible en `docs/TASKS.md`.
3. Crear una rama con un nombre breve, por ejemplo `codex/mejora-documentacion`.
4. Implementar código, pruebas y documentación juntos.
5. Ejecutar `npm run release:check`.
6. Crear commits pequeños con mensajes como `feat: add documentation center`.
7. Abrir un pull request usando `.github/pull_request_template.md`.
8. Corregir observaciones y esperar todas las validaciones verdes antes de integrar.

## Issues

La carpeta `.github/ISSUE_TEMPLATE/` incluye:

- `bug_report.md`: para algo que debería funcionar y no funciona;
- `feature_request.md`: para una capacidad nueva o mejora.

Un buen reporte de error incluye resultado esperado, resultado real, pasos reproducibles, entorno y evidencia sin datos sensibles. Una buena mejora explica el problema del usuario antes de proponer una solución.

## Pull requests

El pull request debe responder:

- ¿qué problema resuelve?;
- ¿qué cambió y qué quedó fuera?;
- ¿cómo se verificó?;
- ¿existen riesgos, migraciones o decisiones pendientes?;
- ¿se actualizaron `TASKS.md`, `CONTINUATION.md` y `CHANGELOG.md`?

No ocultar pruebas fallidas ni mezclar cambios ajenos. Las conversaciones de revisión deben resolverse con evidencia: prueba, captura, contrato o referencia técnica.

## GitHub Actions preparado

`.github/workflows/ci.yml` ejecuta en Node.js 22 y 24:

1. instalación reproducible con `npm ci`;
2. formato y lint;
3. tipos;
4. pruebas;
5. compilación;
6. recorrido E2E empaquetado en Chromium;
7. revisión de secretos en el bundle;
8. presupuesto de rendimiento web;
9. enlaces, estructura documental y licencias de terceros;
10. continuidad y demo gratuita.

CI valida una candidata local. Un workflow futuro de despliegue también deberá
exigir `npm run predeploy:check` y la evidencia de las
[13 puertas](TESTING.md); no se añadirá un despliegue automático antes de elegir
infraestructura y autorizaciones.

`.github/workflows/ios.yml` prepara una compilación iOS sin firma, pero solo podrá validarse en GitHub o macOS cuando exista remoto y el propietario decida continuar esa plataforma.

## Protección recomendada para `main`

Cuando exista el remoto:

- exigir pull request;
- exigir CI verde;
- impedir force push y borrado de `main`;
- requerir al menos una revisión cuando haya más colaboradores;
- limitar secretos de Actions por entorno y privilegio mínimo.

No configurar reglas, colaboradores, secretos ni despliegues sin autorización del propietario.

## Recuperar un error

- Un archivo modificado aún no confirmado puede corregirse editándolo de nuevo.
- Un commit local puede repararse con otro commit.
- Un cambio ya compartido debe revertirse de forma trazable, no borrar historia.
- Si aparece un secreto, detener el trabajo, revocarlo y seguir el procedimiento de `SECURITY.md`; eliminarlo del último archivo no basta.

Ante dudas, conservar la historia y pedir revisión antes de ejecutar operaciones destructivas.
