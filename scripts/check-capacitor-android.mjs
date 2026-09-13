import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const requiredFiles = [
  'android/app/build.gradle',
  'android/variables.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/debug/AndroidManifest.xml',
  'android/app/src/main/assets/public/index.html',
  'android/app/src/main/assets/capacitor.config.json',
  'android/app/src/main/assets/capacitor.plugins.json',
]

await Promise.all(requiredFiles.map((path) => access(resolve(root, path))))

const [
  appGradle,
  variables,
  mainManifest,
  debugManifest,
  sourceIndex,
  copiedIndex,
  plugins,
] = await Promise.all([
  readFile(resolve(root, requiredFiles[0]), 'utf8'),
  readFile(resolve(root, requiredFiles[1]), 'utf8'),
  readFile(resolve(root, requiredFiles[2]), 'utf8'),
  readFile(resolve(root, requiredFiles[3]), 'utf8'),
  readFile(resolve(root, 'apps/web/dist/index.html'), 'utf8'),
  readFile(resolve(root, requiredFiles[4]), 'utf8'),
  readFile(resolve(root, requiredFiles[6]), 'utf8'),
])

const expectations = [
  [appGradle.includes('applicationId "com.smarttalky.app"'), 'application ID'],
  [appGradle.includes('versionName "0.1.0"'), 'versión visible'],
  [variables.includes('minSdkVersion = 24'), 'Android mínimo 24'],
  [variables.includes('compileSdkVersion = 36'), 'compile SDK 36'],
  [variables.includes('targetSdkVersion = 36'), 'target SDK 36'],
  [sourceIndex === copiedIndex, 'copia exacta del index web'],
  [debugManifest.includes('android:usesCleartextTraffic="true"'), 'HTTP de depuración'],
  [!mainManifest.includes('usesCleartextTraffic'), 'release sin HTTP abierto'],
  [
    plugins.includes('com.capacitorjs.plugins.app.AppPlugin'),
    'plugin nativo del botón Atrás',
  ],
]

for (const [valid, label] of expectations) {
  if (!valid) throw new Error(`Proyecto Android inválido: ${label}.`)
}

const permissions = [
  ...mainManifest.matchAll(/<uses-permission android:name="([^"]+)"/g),
].map(([, permission]) => permission)
if (permissions.length !== 1 || permissions[0] !== 'android.permission.INTERNET') {
  throw new Error('Android solicita permisos no aprobados para el MVP.')
}

const sensitiveFiles = await Promise.all(
  requiredFiles.map((path) => readFile(resolve(root, path), 'utf8')),
)
if (sensitiveFiles.some((content) => /OPENAI_API_KEY|sk-[A-Za-z0-9_-]+/.test(content))) {
  throw new Error('El proyecto Android no debe contener secretos.')
}

console.log('Proyecto Android preparado con identidad, permisos y bundle verificados.')
