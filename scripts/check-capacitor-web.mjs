import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const webDirectory = resolve(projectRoot, 'apps/web/dist')
const indexPath = resolve(webDirectory, 'index.html')

await access(indexPath)
const indexHtml = await readFile(indexPath, 'utf8')

if (!/<head(?:\s[^>]*)?>/i.test(indexHtml)) {
  throw new Error('El bundle móvil no contiene la etiqueta <head> requerida.')
}

if (!/<div\s+id=["']root["']/i.test(indexHtml)) {
  throw new Error('El bundle móvil no contiene el punto de montaje de SmartTalky.')
}

console.log(`Bundle móvil verificable: ${webDirectory}`)
