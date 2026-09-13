import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const lock = JSON.parse(await readFile(resolve(root, 'package-lock.json'), 'utf8'))
const packages = new Map()

for (const [lockPath, metadata] of Object.entries(lock.packages ?? {})) {
  if (!lockPath.includes('node_modules/') || typeof metadata.version !== 'string') {
    continue
  }

  const name = lockPath.split('node_modules/').at(-1)
  if (name === undefined || name.length === 0) continue

  const key = `${name}@${metadata.version}`
  packages.set(key, {
    license:
      typeof metadata.license === 'string' && metadata.license.length > 0
        ? metadata.license
        : 'No declarada en package-lock.json',
    name,
    version: metadata.version,
  })
}

const rows = [...packages.values()]
  .sort((left, right) =>
    `${left.name}@${left.version}`.localeCompare(`${right.name}@${right.version}`, 'en'),
  )
  .map(
    ({ license, name, version }) =>
      `| \`${name}\` | \`${version}\` | ${license.replaceAll('|', '\\|')} |`,
  )
  .join('\n')

const contents = `# Licencias de terceros

> Archivo generado desde \`package-lock.json\` mediante
> \`npm run licenses:generate\`. No editar manualmente.

SmartTalky incorpora las dependencias npm enumeradas a continuación. Esta tabla
es un inventario informativo de los identificadores de licencia declarados en el
lockfile; los textos y condiciones que distribuye cada paquete continúan siendo
la fuente jurídica aplicable a ese paquete.

La presencia de una dependencia en esta lista no concede una licencia sobre el
código propio de SmartTalky. La licencia del proyecto permanece pendiente hasta
que el propietario cree \`LICENSE\`.

| Paquete | Versión | Licencia declarada |
|---|---:|---|
${rows}

Total: ${packages.size} combinaciones únicas de paquete y versión.
`

const target = resolve(root, 'THIRD_PARTY_LICENSES.md')

if (process.argv.includes('--check')) {
  const current = await readFile(target, 'utf8').catch(() => '')
  if (current !== contents) {
    throw new Error(
      'THIRD_PARTY_LICENSES.md está desactualizado. Ejecute npm run licenses:generate.',
    )
  }
  console.log(`Inventario de terceros vigente: ${packages.size} paquetes/versiones.`)
} else {
  await writeFile(target, contents, 'utf8')
  console.log(`Inventario de terceros generado: ${packages.size} paquetes/versiones.`)
}
