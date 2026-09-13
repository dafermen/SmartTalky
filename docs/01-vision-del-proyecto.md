# Visión del proyecto

## Problema

Las personas hispanohablantes encuentran diferencias importantes entre la ortografía y la pronunciación del inglés. Las herramientas genéricas suelen reproducir audio, pero no siempre explican el acento, la segmentación o la diferencia entre una pronunciación natural y una práctica deliberadamente lenta.

## Propuesta de valor

SmartTalky ofrecerá una experiencia breve y enfocada: escribir una palabra o frase corta, comprender sus datos educativos y escucharla de tres maneras útiles para aprender. La aplicación debe seguir siendo explorable si OpenAI no está configurado, mediante la voz disponible en el navegador.

## Público inicial

- Personas adultas y jóvenes hispanohablantes que aprenden inglés.
- Estudiantes que necesitan practicar vocabulario o frases cortas de forma autónoma.
- Usuarios web móviles que valoran una interacción simple, accesible y no infantil.

## Objetivos

1. Reducir la fricción entre consultar una palabra y practicar su pronunciación.
2. Explicar visualmente información como IPA, sílabas y acento cuando esté disponible.
3. Reutilizar audios para controlar latencia y costos.
4. Mantener una experiencia útil sin cuentas y con almacenamiento local.
5. Construir una base mantenible que pueda llegar primero a iOS y después a Android.

## No objetivos del MVP

No se evaluará la voz del estudiante, no habrá cursos extensos, cuentas, pagos, PostgreSQL activo, inglés británico operativo ni interfaces distintas del español. Estas posibilidades permanecen en el roadmap futuro.

## Principios de producto

- Claridad educativa antes que cantidad de funciones.
- Una acción principal por vista.
- Transparencia sobre las limitaciones de las voces sintéticas.
- Privacidad y control de costos desde el diseño.
- Accesibilidad, interfaz mobile-first y lenguaje respetuoso.

## Indicadores iniciales de éxito

Durante el MVP se medirán localmente métricas técnicas agregadas: solicitudes, aciertos de caché, generaciones y errores. Antes de instrumentar analítica de aprendizaje se definirá una política de privacidad. El éxito funcional inicial será completar de manera confiable el recorrido entrada → información → audio → historial/favorito.
