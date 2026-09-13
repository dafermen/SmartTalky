import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const requiredFiles = [
  'ios/App/App.xcodeproj/project.pbxproj',
  'ios/App/App/AppDelegate.swift',
  'ios/App/App/Info.plist',
  'ios/App/CapApp-SPM/Package.swift',
  'ios/App/App/public/index.html',
  '.github/workflows/ios.yml',
]

await Promise.all(requiredFiles.map((path) => access(resolve(root, path))))

const [project, infoPlist, packageSwift, sourceIndex, copiedIndex, workflow] =
  await Promise.all([
    readFile(resolve(root, requiredFiles[0]), 'utf8'),
    readFile(resolve(root, requiredFiles[2]), 'utf8'),
    readFile(resolve(root, requiredFiles[3]), 'utf8'),
    readFile(resolve(root, 'apps/web/dist/index.html'), 'utf8'),
    readFile(resolve(root, requiredFiles[4]), 'utf8'),
    readFile(resolve(root, requiredFiles[5]), 'utf8'),
  ])

const expectations = [
  [project.includes('PRODUCT_BUNDLE_IDENTIFIER = com.smarttalky.app;'), 'bundle ID'],
  [project.includes('IPHONEOS_DEPLOYMENT_TARGET = 15.0;'), 'destino iOS 15'],
  [project.includes('MARKETING_VERSION = 0.1.0;'), 'versión visible'],
  [packageSwift.includes('exact: "8.4.2"'), 'dependencia Capacitor 8.4.2'],
  [sourceIndex === copiedIndex, 'copia exacta del index web'],
  [workflow.includes('runs-on: macos-26'), 'runner macOS compatible'],
  [workflow.includes('CODE_SIGNING_ALLOWED=NO'), 'compilación CI sin firma'],
]

for (const [valid, label] of expectations) {
  if (!valid) throw new Error(`Proyecto iOS inválido: ${label}.`)
}

if (/NS[A-Za-z]+UsageDescription/.test(infoPlist)) {
  throw new Error('Info.plist solicita un permiso sensible no aprobado para el MVP.')
}

if (/\$\{\{\s*secrets\./.test(workflow) || /DEVELOPMENT_TEAM\s*=/.test(project)) {
  throw new Error('La preparación iOS no debe contener secretos ni equipo de firma.')
}

console.log('Proyecto iOS y compilación macOS preparados sin permisos ni firma.')
