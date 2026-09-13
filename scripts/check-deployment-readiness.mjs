import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const strict = process.argv.includes('--strict')
const gatesPath = resolve(import.meta.dirname, '..', 'docs', 'deployment-gates.json')
const manifest = JSON.parse(readFileSync(gatesPath, 'utf8'))
const expectedIds = Array.from({ length: 13 }, (_, index) => index + 1)
const actualIds = manifest.gates.map((gate) => gate.id)

if (
  actualIds.length !== expectedIds.length ||
  actualIds.some((id, index) => id !== expectedIds[index])
) {
  throw new Error(
    'La matriz de despliegue debe contener exactamente las puertas 1 a 13 en orden.',
  )
}

const allowedStatuses = new Set(['complete', 'partial', 'pending'])
for (const gate of manifest.gates) {
  if (!allowedStatuses.has(gate.status)) {
    throw new Error(`Estado inválido en la puerta ${gate.id}: ${gate.status}`)
  }
  if (!Array.isArray(gate.evidence) || gate.evidence.length === 0) {
    throw new Error(`La puerta ${gate.id} no declara evidencia o brecha.`)
  }
}

const blockers = manifest.gates.filter(
  (gate) => gate.requiredBeforePublicDeployment && gate.status !== 'complete',
)

console.log(`Preparación para despliegue: ${13 - blockers.length}/13 puertas completas.`)
for (const gate of manifest.gates) {
  const marker =
    gate.status === 'complete'
      ? 'OK'
      : gate.status === 'partial'
        ? 'PARCIAL'
        : 'PENDIENTE'
  console.log(`${String(gate.id).padStart(2, '0')}. [${marker}] ${gate.name}`)
}

if (blockers.length > 0) {
  console.log(
    `Bloqueos para publicación pública: ${blockers
      .map((gate) => `${gate.id}. ${gate.name}`)
      .join('; ')}.`,
  )
}

if (strict && blockers.length > 0) {
  throw new Error(
    'Despliegue bloqueado. Complete las puertas y registre evidencia antes de publicar.',
  )
}

if (blockers.length === 0) {
  console.log('Todas las puertas previas al despliegue público están completas.')
}
