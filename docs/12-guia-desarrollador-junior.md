# Guía para desarrolladores junior

## Antes de escribir código: el mapa mental

Imagina SmartTalky como una escuela pequeña:

- **la web** es el salón que ve el estudiante;
- **la API** es la recepción que valida solicitudes y coordina el trabajo;
- **los servicios de dominio** contienen las reglas;
- **los adaptadores** hablan con OpenAI, archivos o funciones del navegador;
- **los paquetes compartidos** son el vocabulario común;
- **las pruebas** son ejemplos ejecutables de lo que debe seguir funcionando;
- **la documentación** explica por qué se tomaron las decisiones.

Cuando algo falla, no conviene cambiar el primer archivo que aparece. Sigue el recorrido del dato y corrige la capa que tiene esa responsabilidad.

```text
Usuario → componente web → cliente HTTP → ruta API → caso de uso
        → caché/proveedor → respuesta validada → interfaz
```

## Tu primera corrección, paso a paso

Ejemplo: el botón Lenta reproduce el modo Natural.

1. Reproduce el problema y anota los pasos exactos.
2. Busca el texto o nombre técnico con `rg`.
3. Sigue la función desde `AudioControls` hasta `pronunciation-player`.
4. Localiza dónde se pierde la modalidad; no cambies OpenAI si el error está en la interfaz.
5. Escribe primero una prueba que falle con ese caso.
6. Haz el cambio mínimo.
7. Ejecuta la prueba cercana y después `npm run release:check`.
8. Actualiza `TASKS.md`, `CHANGELOG.md` y `CONTINUATION.md`.

La corrección está terminada cuando la causa queda cubierta, no solo cuando “parece funcionar” una vez.

## Tu primera mejora, paso a paso

Ejemplo: agregar una explicación debajo de un modo.

1. Confirma que pertenece al alcance actual.
2. Registra una tarea con criterio observable.
3. Agrega el texto en `apps/web/src/i18n/locales/es.ts`.
4. Usa tokens y componentes existentes en vez de inventar colores o botones.
5. Prueba el nombre accesible, teclado y vista móvil.
6. Documenta la decisión si afecta a futuros desarrolladores.

Si la mejora necesita cuentas, micrófono, pagos, una nueva plataforma o datos remotos, detente: requiere una decisión de producto y seguridad antes de programar.

## Por dónde empezar

1. Ejecute `npm install` desde la raíz.
2. Ejecute `npm test` y `npm run build` para confirmar la base.
3. Lea `docs/TASKS.md`; trabaje solo en la tarea `EN_PROGRESO`.
4. Antes de terminar, ejecute toda la calidad y actualice `docs/CONTINUATION.md`.
5. Ejecute `npm run docs:check` cuando cambie enlaces y `npm run demo:check` antes de una demostración.

## Organización

- `apps/web/src/App.tsx`: superficie web actual.
- `apps/web/src/pages/`: páginas de práctica, acerca de y 404.
- `apps/web/src/app/`: layout y navegación.
- `apps/web/src/features/practice/`: formulario, tarjeta, cliente API y modalidades.
- `apps/web/src/features/speech/`: adaptador Web Speech, voces `en-US` y failover del reproductor.
- `apps/web/src/features/progress/`: historial, favoritos, preferencias, exportación y migraciones locales.
- `apps/web/src/data/query-client.ts`: configuración aislable de TanStack Query.
- `apps/web/src/i18n/`: configuración y traducciones españolas.
- `apps/web/src/styles.css`: Tailwind, tokens y estilos globales.
- `apps/api/src/app.ts`: composición de middleware/rutas sin abrir un puerto.
- `apps/api/src/server.ts`: proceso, puerto y cierre controlado.
- `apps/api/src/config/`: entorno tipado.
- `apps/api/src/features/pronunciation/`: ruta, caso de uso y proveedor falso.
- `apps/api/src/features/audio/`: ruta, caso de uso y repositorio falso.
- `apps/api/src/openapi/`: documento OpenAPI, endpoint y pruebas contractuales.
- `apps/api/src/domain/`: errores operativos compartidos.
- `apps/api/src/http/`: rutas y middleware HTTP.
- `apps/api/src/observability/`: logs estructurados.
- `packages/types`: contratos TypeScript y literales mínimos.
- `packages/shared`: esquemas Zod, normalización y límites compartidos.
- `packages/config`: configuración TypeScript reutilizable.
- `packages/ui`: `Button`, `Card` y `TextField` reutilizables.
- `docs/`: decisiones, guías, tareas y continuidad.

## Agregar un endpoint

Defina primero su contrato en `packages/types` y su esquema en `packages/shared`. Cree la funcionalidad bajo `apps/api/src/features/<domain>/` separando `application`, `http` e `infrastructure`; móntela en `createApp` mediante inyección y pruebe con Supertest sin abrir un puerto. No coloque reglas de negocio, acceso a OpenAI o rutas de archivos dentro del controlador.

Ejemplo conceptual:

```ts
router.get('/', (_request, response) => {
  response.status(200).json({ status: 'ok' })
})
```

## Agregar o modificar una modalidad

Actualice `PRONUNCIATION_MODES` en `packages/types`; TypeScript derivará la unión. Después actualice esquemas/ejemplos OpenAPI, proveedor, interfaz, pruebas y documentación. En Fase 4 también deberá actualizar prompts versionados e identidad de caché para no reutilizar audio incompatible.

## Recorrer una solicitud real

1. Inicie API y web con `npm run dev`.
2. Escriba `comfortable` y pulse “Preparar pronunciación”.
3. La web enviará `locale: en-US` y los tres modos a `/api/v1/pronunciations`.
4. Verifique la respuesta en la tarjeta y el contrato en `/api/v1/openapi.json`.
5. Si el puerto API cambia, configure `SMARTTALKY_API_TARGET`; no incruste URLs en componentes.

El ejemplo se verifica automáticamente en los tests del cliente web, Supertest y OpenAPI.

## Entender el audio y el progreso local

El reproductor intenta primero el audio opaco devuelto por la API. Una clave `mock-*`, un audio ausente o un fallo controlado activa Web Speech. El componente solo recibe un resultado `provider` o `web-speech` y presenta el origen; no debe inspeccionar SDKs ni secretos.

Web Speech se accede exclusivamente mediante `createWebSpeechAdapter`. Las pruebas inyectan síntesis y utterances falsos; nunca dependen de las voces instaladas en la máquina. La lista de configuración filtra `en-US`, escucha `voiceschanged` y descarta preferencias que ya no existen.

`createLocalProgressStore` mantiene snapshots estables para React y persiste un documento versionado. Al cambiar su forma:

1. incremente `LOCAL_PROGRESS_VERSION`;
2. agregue una migración explícita desde cada versión admitida;
3. conserve fixtures de versiones anteriores;
4. verifique corrupción, versión desconocida y fallo de escritura sin bloquear la práctica.

No incluya texto local en logs ni sincronice el progreso con el backend sin una decisión de producto y privacidad.

## Cambiar colores o textos

Cambie tokens semánticos bajo `@theme` en `apps/web/src/styles.css`; no repita hexadecimales en componentes. Vuelva a calcular contraste si cambia foreground/background. Cambie textos en `apps/web/src/i18n/locales/es.ts`, conservando las mismas claves y parámetros. No escriba prosa visible directamente en componentes.

Para agregar un componente UI, colóquelo en `packages/ui/src/components`, expórtelo desde `packages/ui/src/index.ts`, documente sus props accesibles y añada una prueba de consumo en la web. La web recompila dependencias internas antes de dev, typecheck, test y build.

## Escribir pruebas

- Web: archivos `*.test.tsx`, React Testing Library y consultas por rol/nombre accesible.
- API: archivos `*.test.ts`, Vitest y Supertest sobre `createApp()`.
- Evite red, tiempo real y servicios pagos; inyecte adaptadores falsos.

Ejecute:

```bash
npm test
npm run test:watch --workspace @smarttalky/web
npm run test:coverage --workspace @smarttalky/api
```

## Investigar errores

Lea el primer error, ejecútelo en el workspace mínimo y escriba una prueba que reproduzca el problema. No use `any`, no desactive reglas globales y no capture errores sin actuar. Para problemas HTTP, use el `x-request-id` para correlacionar respuesta y log.

Para una revisión de release, siga la matriz de `docs/14-pruebas.md`, el checklist de seguridad de `docs/08-seguridad.md` y el guion de `docs/17-demo-mvp-web.md`. La candidata no autoriza publicación, creación de remoto ni uso de OpenAI pagado.

## Archivos generados

- `node_modules/`: dependencias y enlaces de workspaces.
- `dist/`: builds de TypeScript/Vite.
- `coverage/`: reportes de Vitest.
- `*.tsbuildinfo`: caché incremental de TypeScript.
- En fases futuras, `storage/audio-cache/` y `storage/data/` contendrán datos locales.

Todos están ignorados por Git. No edite artefactos: modifique la fuente y vuelva a generarlos.

## Elementos delicados

No modifique sin revisar impacto: `package-lock.json`, orden de workspaces, `allowScripts`, contratos compartidos, versiones de prompts/caché, middleware de errores, redacción de logs, `.gitignore` y workflows de CI. Nunca coloque `OPENAI_API_KEY` en la web.
