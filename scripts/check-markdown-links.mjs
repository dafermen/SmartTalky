import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'

const rootDirectory = resolve(import.meta.dirname, '..')
const rootDocuments = [
  'AGENTS.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'CURRENT_STATUS.md',
  'README.md',
  'SECURITY.md',
  'THIRD_PARTY_LICENSES.md',
]

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return markdownFiles(path)
    return extname(entry.name).toLowerCase() === '.md' ? [path] : []
  })
}

const files = [
  ...rootDocuments.map((name) => resolve(rootDirectory, name)),
  ...markdownFiles(resolve(rootDirectory, 'docs')),
]
const brokenLinks = []
const markdownLink = /!?\[[^\]]*\]\(([^)]+)\)/g

for (const file of files) {
  const contents = readFileSync(file, 'utf8')
  for (const match of contents.matchAll(markdownLink)) {
    const rawTarget = match[1]?.trim()
    if (
      rawTarget === undefined ||
      rawTarget.startsWith('#') ||
      /^(?:https?:|mailto:)/i.test(rawTarget)
    ) {
      continue
    }

    const targetWithoutTitle = rawTarget.replace(/^<|>$/g, '').split('#', 1)[0]
    if (targetWithoutTitle === undefined || targetWithoutTitle.length === 0) continue
    const target = resolve(dirname(file), decodeURIComponent(targetWithoutTitle))

    if (
      !existsSync(target) ||
      (!statSync(target).isFile() && !statSync(target).isDirectory())
    ) {
      brokenLinks.push(`${file.slice(rootDirectory.length + 1)} -> ${rawTarget}`)
    }
  }
}

if (brokenLinks.length > 0) {
  throw new Error(`Enlaces locales rotos:\n${brokenLinks.join('\n')}`)
}

console.log(
  `Documentación verificada: ${files.length} archivos sin enlaces locales rotos.`,
)
