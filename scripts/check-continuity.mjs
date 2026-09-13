import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const requiredFiles = [
  'AGENTS.md',
  'CURRENT_STATUS.md',
  'docs/TASKS.md',
  'docs/CONTINUATION.md',
]

for (const relativePath of requiredFiles) {
  if (!existsSync(resolve(root, relativePath))) {
    throw new Error(`Falta el archivo obligatorio de continuidad: ${relativePath}`)
  }
}

const agents = readFileSync(resolve(root, 'AGENTS.md'), 'utf8')
const currentStatus = readFileSync(resolve(root, 'CURRENT_STATUS.md'), 'utf8')
const tasks = readFileSync(resolve(root, 'docs/TASKS.md'), 'utf8')
const activeTasks = [...tasks.matchAll(/\|\s*(ST-\d+)\s*\|[^\n]*`EN_PROGRESO`/g)]

if (!agents.includes('CURRENT_STATUS.md') || !agents.includes('continuity:check')) {
  throw new Error('AGENTS.md no exige leer y verificar CURRENT_STATUS.md.')
}

if (!currentStatus.includes('Última actualización:')) {
  throw new Error('CURRENT_STATUS.md no declara su fecha de actualización.')
}

if (!currentStatus.includes('## Próximo paso recomendado')) {
  throw new Error('CURRENT_STATUS.md no declara el próximo paso recomendado.')
}

if (activeTasks.length > 1) {
  throw new Error(
    `Existen varias tareas EN_PROGRESO: ${activeTasks.map((match) => match[1]).join(', ')}.`,
  )
}

console.log(
  activeTasks.length === 0
    ? 'Continuidad verificada: no existe una tarea EN_PROGRESO.'
    : `Continuidad verificada: ${activeTasks[0][1]} es la única tarea EN_PROGRESO.`,
)
