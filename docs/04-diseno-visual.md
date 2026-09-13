# Diseño visual

## Personalidad

Moderna, limpia, amable, motivadora, confiable y educativa sin resultar infantil. La pantalla principal debe conducir a una sola acción: escribir y escuchar.

## Símbolo de marca

El símbolo de SmartTalky combina un globo de conversación blanco con cuatro barras de voz índigo y turquesa sobre un contenedor redondeado. La forma comunica conversación y pronunciación sin depender de una inicial, por lo que puede reutilizarse al ampliar idiomas.

La fuente canónica es `apps/web/public/favicon.svg`. Se usa como marca del encabezado y favicon SVG; el navegador recibe además el color de tema índigo. El enlace de inicio conserva un nombre accesible completo, mientras la imagen es decorativa para evitar anunciar “SmartTalky” dos veces.

## Tokens implementados

| Rol | Valor |
|---|---|
| Primario | `#4F46E5` |
| Secundario | `#0F766E` |
| Acento / sílaba tónica | `#F59E0B` |
| Fondo cálido | `#FAFAF7` |
| Superficie lavanda | `#EEEDFF` |
| Superficie turquesa | `#E7F6F3` |
| Texto principal | `#172033` |
| Texto secundario | `#526075` |
| Éxito | `#22C55E` |
| Error | `#EF4444` |

Los valores de marca se conservan en `apps/web/src/styles.css` mediante `@theme`. La proporción visual prioriza fondos neutros cálidos, usa índigo para las acciones, turquesa como apoyo y reserva ámbar para la sílaba tónica. Los componentes consumen nombres semánticos: `brand-primary`, `brand-soft`, `secondary-soft`, `surface`, `ink`, `border`, `focus`, superficies/ink de éxito, error y sílaba tónica. Los controles usan radio `0.75rem`, tarjetas `1.25rem`, sombra suave y anillo de foco índigo visible. La tipografía usa la pila del sistema para evitar una descarga bloqueante.

El ámbar de marca no se usa como texto sobre blanco. Para el énfasis silábico se combina fondo `#FEF3C7` con texto `#92400E`.

## Contraste verificado

| Combinación | Relación WCAG |
|---|---:|
| Texto principal / fondo | 17.06:1 |
| Blanco / índigo primario | 6.29:1 |
| Texto principal / ámbar | 8.31:1 |
| Texto de acento / fondo de acento | 6.37:1 |
| Texto de éxito / fondo de éxito | 6.49:1 |
| Texto de error / fondo de error | 6.80:1 |
| Texto principal / turquesa | 7.17:1 |

Todas superan 4.5:1 para texto normal. Ningún estado se comunica solo con color: incluye texto, iconografía textual o atributos accesibles.

## Principios de interacción

- Diseño mobile-first y objetivos táctiles cómodos.
- Jerarquía legible, suficiente espacio en blanco y foco visible.
- Controles de audio con nombre accesible y estado anunciado.
- Estados explícitos: vacío, cargando, reproduciendo, éxito y error.
- Animaciones discretas desactivables mediante `prefers-reduced-motion`.
- Ámbar reservado principalmente para el énfasis educativo.

## Pantalla de referencia implementada

![Referencia real de la pantalla principal](images/smarttalky-inicio-escritorio.png)

La pantalla incluye encabezado fijo, navegación breve, hero educativo, formulario con ejemplos rápidos, acción primaria, recorrido explicativo en tres pasos, área de estados y tarjeta educativa protagonista. Los modos Natural, Lenta y Profesor son tarjetas táctiles completas con explicación, acción y estado. Historial/favoritos y preferencias/datos permanecen disponibles en paneles plegables, pero ya no compiten con el flujo principal.

Los breakpoints se usan de manera mobile-first: una columna por defecto; grids de datos/modos desde `sm`; hero en dos columnas desde `lg`. El ancho de lectura se limita a `max-w-6xl` y los controles tienen al menos 48 px de alto.

![Referencia real mobile-first](images/smarttalky-inicio-movil.png)

## Componentes fundamentales

- `Button`: variantes primaria/secundaria/ghost, ancho completo opcional y foco visible.
- `TextField`: label obligatorio, ayuda/error relacionados mediante `aria-describedby` y `aria-invalid`.
- `Card`: agrupación semántica sobre superficie elevada.

Viven en `packages/ui/src` y se exportan desde `@smarttalky/ui`. Tailwind descubre sus clases mediante `@source` en la hoja de la web.

## Estados

- Vacío con orientación y ejemplos.
- Carga con `aria-busy`, texto y skeleton decorativo.
- Éxito con datos educativos y ausencia explícita de valores no disponibles.
- Error con `role="alert"` y posibilidad de reenviar el formulario.
- Reproducción con `aria-pressed`, bloqueo de botones equivalentes y anuncios `aria-live`.

## Accesibilidad verificada

- Axe en jsdom: sin violaciones automatizables en la vista inicial; contraste se valida por separado porque jsdom no calcula estilos reales.
- Skip-link, landmarks, labels, roles, foco visible y `prefers-reduced-motion` implementados.
- Relaciones de contraste documentadas arriba.
- Inspección en navegador real completada en 320×568, 768×1024 y 1440×900: sin desbordamiento del documento, consola limpia y flujo formulario–resultado–modalidades operativo.
- El reflow a 320 px proporciona una comprobación equivalente a una ampliación de 450% respecto al viewport de escritorio. El skip-link recibe foco visible y los controles conservan nombres accesibles únicos.
- La revisión detectó y corrigió el salto de línea de “Acerca de” a 320 px mediante espaciado adaptable y `white-space: nowrap`.
- Auditoría de Fase 6: Axe verde también con guía completa, progreso local, privacidad y 404; el skip-link recibe el primer foco y tras activarlo enfoca el landmark principal.

## Matriz responsive de la Fase 6

| Viewport | Estado verificado | Resultado |
|---|---|---|
| 320×568 | Hero, formulario, guía completa, favorito y progreso local | una columna, controles táctiles, textos legibles y sin overflow horizontal |
| 768×1024 | Historial, favoritos, preferencias y controles de datos | tarjetas apiladas, selects en dos columnas y acciones con wrap seguro |
| 1440×900 | Hero y guía educativa completa | composición de escritorio, ancho de lectura limitado y grids coherentes |

Las mediciones compararon `scrollWidth`, `clientWidth` e `innerWidth`; no apareció contenido interactivo fuera del viewport. Los círculos decorativos del hero se recortan deliberadamente mediante `overflow-hidden` y no generan desplazamiento horizontal.

## Internacionalización visual

Los componentes admiten expansión de texto y los textos visibles se resuelven desde `apps/web/src/i18n/locales/es.ts`. La configuración separa idioma de interfaz, idioma nativo, idioma de aprendizaje y locale de pronunciación. Para agregar otro idioma, cree un recurso paralelo con las mismas claves, regístrelo en `i18n/config.ts` y añada pruebas de resolución/fallback.
