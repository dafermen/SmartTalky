import { readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const distributionDirectory = resolve(import.meta.dirname, '..', 'apps', 'web', 'dist')
const html = readFileSync(resolve(distributionDirectory, 'index.html'), 'utf8')
const initialAssetPattern =
  /<(?:script[^>]+src|link[^>]+rel="modulepreload"[^>]+href)="([^"]+\.js)"/g
const initialAssets = [
  ...new Set([...html.matchAll(initialAssetPattern)].map((match) => match[1])),
]

if (initialAssets.length === 0) {
  throw new Error('No se encontraron recursos JavaScript iniciales en el bundle web.')
}

const measurements = initialAssets.map((asset) => {
  const bytes = readFileSync(resolve(distributionDirectory, asset.replace(/^\//, '')))
  return {
    asset: basename(asset),
    rawBytes: bytes.byteLength,
    gzipBytes: gzipSync(bytes).byteLength,
  }
})
const totalRawBytes = measurements.reduce((total, item) => total + item.rawBytes, 0)
const totalGzipBytes = measurements.reduce((total, item) => total + item.gzipBytes, 0)
const maximumRawBytes = 500 * 1024
const maximumGzipBytes = 150 * 1024

if (initialAssets.some((asset) => asset.includes('jsx-dev-runtime'))) {
  throw new Error('El bundle de producción contiene el runtime JSX de desarrollo.')
}

if (totalRawBytes > maximumRawBytes || totalGzipBytes > maximumGzipBytes) {
  const details = measurements
    .map(
      ({ asset, rawBytes, gzipBytes }) =>
        `- ${asset}: ${(rawBytes / 1024).toFixed(1)} KiB / ${(gzipBytes / 1024).toFixed(1)} KiB gzip`,
    )
    .join('\n')
  throw new Error(
    `El JavaScript inicial excede el presupuesto de 500 KiB / 150 KiB gzip.\n${details}`,
  )
}

console.log(
  `Rendimiento web verificado: ${(totalRawBytes / 1024).toFixed(1)} KiB iniciales / ${(totalGzipBytes / 1024).toFixed(1)} KiB gzip.`,
)
