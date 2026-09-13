# Alcance y requisitos

## Alcance del MVP

- Web responsive y mobile-first en español.
- Entrada validada de palabras y frases cortas en inglés estadounidense.
- Información educativa disponible: IPA, sílabas, sílaba tónica, traducción y ejemplo.
- Audio en modos `natural`, `slow` y `teacher`.
- OpenAI TTS desde el backend, con Web Speech API como respaldo.
- Caché persistente, deduplicación concurrente y entrega controlada de audio.
- Historial, favoritos y preferencias en almacenamiento local.
- Internacionalización preparada, implementando solo español.
- Pruebas, documentación, CI y controles básicos de seguridad.

## Fuera del MVP

Cuentas, pagos, base de datos activa, micrófono y evaluación de pronunciación, cursos completos, administración compleja, publicación en tiendas, inglés británico e interfaces adicionales.

## Requisitos funcionales

| ID | Requisito |
|---|---|
| RF-01 | El usuario puede introducir una palabra o frase corta y recibir errores comprensibles. |
| RF-02 | El sistema normaliza espacios sin cambiar el significado del texto. |
| RF-03 | La interfaz muestra la información educativa disponible y distingue datos ausentes. |
| RF-04 | El usuario puede solicitar los modos natural, lento y profesor. |
| RF-05 | La API reutiliza un audio compatible antes de llamar al proveedor. |
| RF-06 | Solicitudes concurrentes equivalentes comparten una única generación. |
| RF-07 | La API informa URL controlada, procedencia de caché, modo, locale y voz. |
| RF-08 | Si el proveedor falta o falla, la interfaz ofrece el respaldo del navegador. |
| RF-09 | La consulta válida se añade al historial local y puede marcarse favorita. |
| RF-10 | El usuario puede conservar y posteriormente limpiar/exportar sus datos locales. |
| RF-11 | Los audios se obtienen solo mediante un endpoint que valida la clave. |
| RF-12 | El endpoint de salud informa disponibilidad sin revelar secretos. |

## Requisitos no funcionales

| ID | Categoría | Requisito verificable |
|---|---|---|
| RNF-01 | Seguridad | La clave de OpenAI solo existe en el backend y nunca aparece en logs o bundles web. |
| RNF-02 | Accesibilidad | El recorrido principal funciona con teclado, etiquetas accesibles y contraste suficiente. |
| RNF-03 | Rendimiento | Un acierto de caché no llama al proveedor y evita trabajo de síntesis. |
| RNF-04 | Resiliencia | La ausencia de `OPENAI_API_KEY` no impide explorar el frontend. |
| RNF-05 | Calidad | Lint, typecheck, pruebas y build se ejecutan en CI sin consumir servicios pagos. |
| RNF-06 | Mantenibilidad | TypeScript opera en modo estricto y los contratos compartidos no se duplican. |
| RNF-07 | Compatibilidad | La interfaz se diseña mobile-first y para navegadores modernos con respaldo explícito. |
| RNF-08 | Privacidad | No se guarda contenido sensible innecesario en logs; los datos de progreso son locales. |
| RNF-09 | Costos | Se valida longitud/frecuencia, se consulta caché primero y se documenta un presupuesto. |
| RNF-10 | Internacionalización | Los textos visibles se resuelven desde claves de traducción. |

## Reglas de dominio iniciales

- `pronunciationLocale` comienza en `en-US`.
- El límite exacto de caracteres será configurable y se decidirá en `ST-304`; debe ser apropiado para frases cortas.
- El modo profesor reproduce una secuencia pedagógica, pero no promete control fonético perfecto.
- La identidad del audio incluye texto normalizado, locale, voz, modo, velocidad, versión de prompt y modelo.
- La falta de datos educativos opcionales no invalida una consulta reproducible.

## Riesgos y mitigaciones

| Riesgo | Tipo | Mitigación inicial |
|---|---|---|
| Pronunciación o segmentación imprecisa | Lingüístico | Mensajes transparentes, contenido opcional y futuras revisiones expertas. |
| Variación del control de velocidad/énfasis | Técnico | Prompts versionados, pruebas manuales y no prometer precisión no garantizada. |
| Costos inesperados del proveedor | Financiero | Caché previa, rate limit, longitud máxima, métricas y presupuesto documentado. |
| Duplicación de solicitudes | Técnico/financiero | Mapa de trabajos en curso y publicación atómica del archivo. |
| Exposición de API key | Seguridad | Integración exclusiva del backend, validación de configuración y logs saneados. |
| Texto sensible en historial o logs | Privacidad | Progreso local, logs mínimos y documentación clara para el usuario. |
| Diferencias entre navegadores | Técnico | Detección de capacidades, respaldo progresivo y matriz de pruebas. |
| Crecimiento ilimitado de caché | Operativo | Metadatos, límite configurable y política de limpieza antes del despliegue. |
| Complejidad móvil prematura | Producto | Estabilizar el MVP web antes de incorporar Capacitor. |
| Dependencia del proveedor | Arquitectura | Interfaz `TextToSpeechProvider` y adaptadores sustituibles. |
