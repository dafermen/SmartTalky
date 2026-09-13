export const documentationCategories = [
  'inicio',
  'producto',
  'ingenieria',
  'calidad',
  'gestion',
  'decisiones',
] as const

export type DocumentationCategory = (typeof documentationCategories)[number]

export interface DocumentationEntry {
  id: string
  title: string
  summary: string
  category: DocumentationCategory
  sourcePath: string
  keywords: string[]
}

export const documentationCatalog: DocumentationEntry[] = [
  {
    id: 'readme',
    title: 'Presentación del proyecto',
    summary: 'Qué es SmartTalky, qué incluye y cómo comenzar.',
    category: 'inicio',
    sourcePath: 'README.md',
    keywords: ['inicio', 'resumen', 'mvp'],
  },
  {
    id: 'indice',
    title: 'Índice general',
    summary: 'Mapa de toda la documentación técnica y de producto.',
    category: 'inicio',
    sourcePath: 'docs/00-indice.md',
    keywords: ['mapa', 'documentos'],
  },
  {
    id: 'desarrollo-estandar',
    title: 'Desarrollo: entrada estándar',
    summary: 'Preparación, comandos, ubicación de cambios y reglas de trabajo.',
    category: 'inicio',
    sourcePath: 'docs/DEVELOPMENT.md',
    keywords: ['desarrollo', 'onboarding', 'comandos', 'estructura'],
  },
  {
    id: 'guia-junior',
    title: 'Guía para desarrolladores junior',
    summary: 'Cómo orientarse, corregir errores y agregar mejoras paso a paso.',
    category: 'inicio',
    sourcePath: 'docs/12-guia-desarrollador-junior.md',
    keywords: ['estudiante', 'aprender', 'primer cambio', 'junior'],
  },
  {
    id: 'instalacion',
    title: 'Instalación local',
    summary: 'Requisitos y comandos para ejecutar SmartTalky.',
    category: 'inicio',
    sourcePath: 'docs/09-instalacion.md',
    keywords: ['configurar', 'entorno', 'npm', 'windows'],
  },
  {
    id: 'problemas',
    title: 'Solución de problemas',
    summary: 'Diagnóstico de errores frecuentes en web, API, audio y móvil.',
    category: 'inicio',
    sourcePath: 'docs/15-solucion-de-problemas.md',
    keywords: ['error', 'diagnostico', 'ayuda'],
  },
  {
    id: 'vision',
    title: 'Visión del proyecto',
    summary: 'Problema, audiencia, propuesta de valor y objetivos.',
    category: 'producto',
    sourcePath: 'docs/01-vision-del-proyecto.md',
    keywords: ['objetivos', 'usuarios', 'valor'],
  },
  {
    id: 'requisitos',
    title: 'Alcance y requisitos',
    summary: 'Requisitos funcionales, no funcionales, límites y criterios.',
    category: 'producto',
    sourcePath: 'docs/02-alcance-y-requisitos.md',
    keywords: ['funcionales', 'no funcionales', 'alcance', 'aceptacion'],
  },
  {
    id: 'diseno',
    title: 'Diseño visual',
    summary: 'Principios de experiencia, interfaz, colores y accesibilidad.',
    category: 'producto',
    sourcePath: 'docs/04-diseno-visual.md',
    keywords: ['ux', 'ui', 'colores', 'accesibilidad'],
  },
  {
    id: 'datos',
    title: 'Modelo de datos',
    summary: 'Entidades, persistencia local, historial y favoritos.',
    category: 'producto',
    sourcePath: 'docs/05-modelo-de-datos.md',
    keywords: ['entidades', 'storage', 'historial'],
  },
  {
    id: 'glosario',
    title: 'Glosario',
    summary: 'Conceptos de pronunciación, producto y tecnología.',
    category: 'producto',
    sourcePath: 'docs/16-glosario.md',
    keywords: ['terminos', 'definiciones'],
  },
  {
    id: 'arquitectura',
    title: 'Arquitectura',
    summary: 'Organización del monorepo y responsabilidades de cada capa.',
    category: 'ingenieria',
    sourcePath: 'docs/03-arquitectura.md',
    keywords: ['web', 'api', 'packages', 'capas'],
  },
  {
    id: 'arquitectura-estandar',
    title: 'Arquitectura: entrada estándar',
    summary: 'Mapa breve de componentes, fronteras y ubicación de pruebas.',
    category: 'ingenieria',
    sourcePath: 'docs/ARCHITECTURE.md',
    keywords: ['arquitectura', 'monorepo', 'estructura', 'capas'],
  },
  {
    id: 'api',
    title: 'API',
    summary: 'Endpoints, contratos, validación y respuestas del backend.',
    category: 'ingenieria',
    sourcePath: 'docs/06-api.md',
    keywords: ['http', 'backend', 'endpoint', 'contrato'],
  },
  {
    id: 'api-estandar',
    title: 'API: entrada estándar',
    summary: 'Resumen de endpoints, compatibilidad, contratos y seguridad.',
    category: 'ingenieria',
    sourcePath: 'docs/API.md',
    keywords: ['api', 'openapi', 'endpoint', 'contrato'],
  },
  {
    id: 'openai',
    title: 'OpenAI TTS y caché',
    summary: 'Generación de voz, perfiles, ahorro de consumo y almacenamiento.',
    category: 'ingenieria',
    sourcePath: 'docs/07-openai-tts-y-cache.md',
    keywords: ['voz', 'audio', 'cache', 'costos'],
  },
  {
    id: 'seguridad',
    title: 'Seguridad de la aplicación',
    summary: 'Controles, secretos, privacidad, amenazas y mitigaciones.',
    category: 'ingenieria',
    sourcePath: 'docs/08-seguridad.md',
    keywords: ['secretos', 'privacidad', 'amenazas'],
  },
  {
    id: 'seguridad-estandar',
    title: 'Seguridad técnica: entrada estándar',
    summary: 'Fronteras de confianza, datos, controles y preparación productiva.',
    category: 'ingenieria',
    sourcePath: 'docs/SECURITY.md',
    keywords: ['seguridad', 'secretos', 'datos', 'produccion'],
  },
  {
    id: 'despliegue',
    title: 'Despliegue',
    summary: 'Preparación y consideraciones para publicar el sistema.',
    category: 'ingenieria',
    sourcePath: 'docs/10-despliegue.md',
    keywords: ['produccion', 'hosting', 'publicar'],
  },
  {
    id: 'despliegue-estandar',
    title: 'Despliegue: entrada estándar',
    summary: 'Entornos, secuencia obligatoria, bloqueos y artefactos.',
    category: 'ingenieria',
    sourcePath: 'docs/DEPLOYMENT.md',
    keywords: ['despliegue', 'staging', 'produccion', 'rollback'],
  },
  {
    id: 'operaciones',
    title: 'Operaciones',
    summary: 'Señales, incidentes, caché, capacidad y mantenimiento.',
    category: 'ingenieria',
    sourcePath: 'docs/OPERATIONS.md',
    keywords: ['operaciones', 'metricas', 'incidente', 'runbook'],
  },
  {
    id: 'movil',
    title: 'Capacitor: Android e iOS',
    summary: 'Adaptación móvil, sincronización, dispositivos y limitaciones.',
    category: 'ingenieria',
    sourcePath: 'docs/11-capacitor-ios-android.md',
    keywords: ['android', 'ios', 'samsung', 'capacitor'],
  },
  {
    id: 'convenciones',
    title: 'Convenciones de código',
    summary: 'Reglas de TypeScript, nombres, estructura y colaboración.',
    category: 'ingenieria',
    sourcePath: 'docs/13-convenciones-de-codigo.md',
    keywords: ['typescript', 'estilo', 'reglas'],
  },
  {
    id: 'github',
    title: 'GitHub y colaboración',
    summary: 'Git, ramas, commits, pull requests, issues y automatización.',
    category: 'ingenieria',
    sourcePath: 'docs/19-github-y-colaboracion.md',
    keywords: ['git', 'github', 'pull request', 'ci'],
  },
  {
    id: 'security-policy',
    title: 'Política de seguridad',
    summary: 'Cómo reportar vulnerabilidades y manejar información sensible.',
    category: 'ingenieria',
    sourcePath: 'SECURITY.md',
    keywords: ['reporte', 'vulnerabilidad'],
  },
  {
    id: 'pruebas',
    title: 'Estrategia de pruebas',
    summary: 'Pruebas unitarias, integración, accesibilidad y verificación.',
    category: 'calidad',
    sourcePath: 'docs/14-pruebas.md',
    keywords: ['test', 'vitest', 'calidad'],
  },
  {
    id: 'pruebas-despliegue',
    title: 'Las 13 puertas de pruebas',
    summary: 'Estrategia obligatoria y estado previo a un despliegue público.',
    category: 'calidad',
    sourcePath: 'docs/TESTING.md',
    keywords: ['mutation', 'fuzzing', 'e2e', 'seguridad', 'despliegue'],
  },
  {
    id: 'demo',
    title: 'Demostración del MVP web',
    summary: 'Recorrido sugerido y evidencia para presentar el producto.',
    category: 'calidad',
    sourcePath: 'docs/17-demo-mvp-web.md',
    keywords: ['presentacion', 'evidencia', 'revision'],
  },
  {
    id: 'release',
    title: 'Checklist de entrega',
    summary: 'Controles previos a declarar una versión candidata.',
    category: 'calidad',
    sourcePath: 'docs/18-checklist-release.md',
    keywords: ['release', 'entrega', 'verificacion'],
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    summary: 'Fases, prioridades y evolución prevista del producto.',
    category: 'gestion',
    sourcePath: 'docs/ROADMAP.md',
    keywords: ['plan', 'fases', 'futuro'],
  },
  {
    id: 'tareas',
    title: 'Estado de tareas',
    summary: 'Fuente operativa con el avance y aceptación de cada tarea.',
    category: 'gestion',
    sourcePath: 'docs/TASKS.md',
    keywords: ['estado', 'pendiente', 'completada'],
  },
  {
    id: 'continuidad',
    title: 'Continuidad del proyecto',
    summary: 'Último relevo: cambios, pruebas, riesgos y siguiente paso.',
    category: 'gestion',
    sourcePath: 'docs/CONTINUATION.md',
    keywords: ['sesion', 'relevo', 'riesgos'],
  },
  {
    id: 'cambios',
    title: 'Historial de cambios',
    summary: 'Evolución funcional y técnica por versiones.',
    category: 'gestion',
    sourcePath: 'CHANGELOG.md',
    keywords: ['changelog', 'versiones'],
  },
  {
    id: 'contribuir',
    title: 'Cómo contribuir',
    summary: 'Flujo y expectativas para colaborar con el repositorio.',
    category: 'gestion',
    sourcePath: 'CONTRIBUTING.md',
    keywords: ['contribucion', 'colaborar'],
  },
  {
    id: 'licencias-terceros',
    title: 'Licencias de terceros',
    summary: 'Inventario reproducible de paquetes, versiones y licencias declaradas.',
    category: 'gestion',
    sourcePath: 'THIRD_PARTY_LICENSES.md',
    keywords: ['licencias', 'dependencias', 'legal'],
  },
  {
    id: 'problemas-estandar',
    title: 'Diagnóstico: entrada estándar',
    summary: 'Ruta rápida para web, API, audio, OpenAI y validaciones.',
    category: 'inicio',
    sourcePath: 'docs/TROUBLESHOOTING.md',
    keywords: ['diagnostico', 'errores', 'ayuda', 'validacion'],
  },
  {
    id: 'adr-arquitectura',
    title: 'ADR-0001: arquitectura inicial',
    summary: 'Decisión y consecuencias de la arquitectura base.',
    category: 'decisiones',
    sourcePath: 'docs/adr/0001-arquitectura-inicial.md',
    keywords: ['adr', 'decision'],
  },
  {
    id: 'adr-capacitor',
    title: 'ADR-0002: contenedor móvil',
    summary: 'Razones para usar Capacitor en Android e iOS.',
    category: 'decisiones',
    sourcePath: 'docs/adr/0002-capacitor-ios.md',
    keywords: ['adr', 'mobile', 'decision'],
  },
  {
    id: 'adr-android',
    title: 'ADR-0003: adelantar Android',
    summary: 'Decisión de avanzar Android mientras iOS está bloqueado.',
    category: 'decisiones',
    sourcePath: 'docs/adr/0003-adelantar-android.md',
    keywords: ['adr', 'android', 'decision'],
  },
  {
    id: 'adr-docker-produccion',
    title: 'ADR-0004: Docker y Nginx en producción',
    summary: 'Contenedores, proxy TLS, puertos y aislamiento para el servidor.',
    category: 'decisiones',
    sourcePath: 'docs/adr/0004-docker-nginx-produccion.md',
    keywords: ['adr', 'docker', 'nginx', 'produccion', 'decision'],
  },
]

export function getDocumentationEntry(id: string | undefined) {
  return documentationCatalog.find((entry) => entry.id === id)
}

export function getDocumentationPublicPath(entry: DocumentationEntry) {
  return `/documentacion/${entry.sourcePath}`
}

/** Convierte los enlaces Markdown relativos en navegación dentro de la aplicación. */
export function resolveDocumentationEntry(
  href: string | undefined,
  currentSourcePath: string,
) {
  if (!href || href.startsWith('#') || /^[a-z]+:/i.test(href)) {
    return undefined
  }

  const base = new URL(currentSourcePath, 'https://smarttalky.local/')
  const resolvedPath = new URL(href, base).pathname.replace(/^\/+/, '')
  const decodedPath = decodeURIComponent(resolvedPath)

  return documentationCatalog.find((entry) => entry.sourcePath === decodedPath)
}
