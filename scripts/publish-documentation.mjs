import { copyFile, mkdir, readFile, readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const publicRoot = resolve(root, 'apps', 'web', 'public', 'documentacion')
const rootDocuments = [
  'README.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'THIRD_PARTY_LICENSES.md',
]
const docs = [
  'API.md',
  'ARCHITECTURE.md',
  'DEPLOYMENT.md',
  'DEVELOPMENT.md',
  'OPERATIONS.md',
  'SECURITY.md',
  'TESTING.md',
  'TROUBLESHOOTING.md',
  '00-indice.md',
  '01-vision-del-proyecto.md',
  '02-alcance-y-requisitos.md',
  '03-arquitectura.md',
  '04-diseno-visual.md',
  '05-modelo-de-datos.md',
  '06-api.md',
  '07-openai-tts-y-cache.md',
  '08-seguridad.md',
  '09-instalacion.md',
  '10-despliegue.md',
  '11-capacitor-ios-android.md',
  '12-guia-desarrollador-junior.md',
  '13-convenciones-de-codigo.md',
  '14-pruebas.md',
  '15-solucion-de-problemas.md',
  '16-glosario.md',
  '17-demo-mvp-web.md',
  '18-checklist-release.md',
  '19-github-y-colaboracion.md',
  'ROADMAP.md',
  'TASKS.md',
  'CONTINUATION.md',
  'adr/0001-arquitectura-inicial.md',
  'adr/0002-capacitor-ios.md',
  'adr/0003-adelantar-android.md',
  'adr/0004-docker-nginx-produccion.md',
]

const publications = [
  ...rootDocuments.map((path) => ({ source: path, target: path })),
  ...docs.map((path) => ({ source: `docs/${path}`, target: `docs/${path}` })),
]

const imageDirectory = resolve(root, 'docs', 'images')
await mkdir(imageDirectory, { recursive: true })
const imageFiles = (await readdir(imageDirectory, { withFileTypes: true }))
  .filter(
    (entry) => entry.isFile() && /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(entry.name),
  )
  .map((entry) => entry.name)

for (const publication of publications) {
  const source = resolve(root, publication.source)
  const target = resolve(publicRoot, publication.target)
  const content = await readFile(source, 'utf8')

  if (/sk-[A-Za-z0-9_-]{20,}/.test(content)) {
    throw new Error(
      `La documentación pública contiene una posible clave: ${publication.source}`,
    )
  }

  await mkdir(dirname(target), { recursive: true })
  await copyFile(source, target)
}

for (const imageFile of imageFiles) {
  const source = resolve(imageDirectory, imageFile)
  const target = resolve(publicRoot, 'docs', 'images', imageFile)
  await mkdir(dirname(target), { recursive: true })
  await copyFile(source, target)
}

console.log(
  `Documentación pública preparada: ${publications.length} textos y ${imageFiles.length} imágenes.`,
)
