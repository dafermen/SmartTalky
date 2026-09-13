import { readdirSync, readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'

const bundleDirectory = resolve(import.meta.dirname, '..', 'apps', 'web', 'dist')
const sensitivePatterns = [
  { label: 'nombre de variable secreta', pattern: /OPENAI_API_KEY/g },
  { label: 'posible clave OpenAI', pattern: /sk-[A-Za-z0-9_-]{20,}/g },
  { label: 'encabezado de autorización', pattern: /Authorization\s*:/gi },
]

function bundleFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return bundleFiles(path)
    return ['.html', '.js', '.css'].includes(extname(entry.name)) ? [path] : []
  })
}

const findings = []
for (const file of bundleFiles(bundleDirectory)) {
  const contents = readFileSync(file, 'utf8')
  for (const { label, pattern } of sensitivePatterns) {
    pattern.lastIndex = 0
    if (pattern.test(contents)) findings.push(`${label}: ${file}`)
  }
}

if (findings.length > 0) {
  throw new Error(`El bundle web contiene patrones sensibles:\n${findings.join('\n')}`)
}

console.log('Bundle web verificado: no contiene patrones de secretos o autorización.')
