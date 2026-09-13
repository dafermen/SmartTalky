import { performance } from 'node:perf_hooks'

const baseURL = process.env.SMARTTALKY_STAGING_URL
const totalRequests = Number.parseInt(process.env.STAGING_LOAD_REQUESTS ?? '5000', 10)
const concurrency = Number.parseInt(process.env.STAGING_LOAD_CONCURRENCY ?? '25', 10)

if (baseURL === undefined || !baseURL.startsWith('https://')) {
  throw new Error('SMARTTALKY_STAGING_URL debe ser una URL HTTPS explícita.')
}
if (!Number.isInteger(totalRequests) || totalRequests < 1 || totalRequests > 20_000) {
  throw new Error('STAGING_LOAD_REQUESTS debe estar entre 1 y 20000.')
}
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 100) {
  throw new Error('STAGING_LOAD_CONCURRENCY debe estar entre 1 y 100.')
}

const target = new URL('/api/v1/health', baseURL)
const latencies = []
let nextRequest = 0
let failures = 0

async function worker() {
  while (nextRequest < totalRequests) {
    nextRequest += 1
    const startedAt = performance.now()
    try {
      const response = await fetch(target, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
      })
      await response.arrayBuffer()
      if (!response.ok) failures += 1
    } catch {
      failures += 1
    } finally {
      latencies.push(performance.now() - startedAt)
    }
  }
}

const startedAt = performance.now()
await Promise.all(Array.from({ length: concurrency }, () => worker()))
const elapsedMs = performance.now() - startedAt
latencies.sort((left, right) => left - right)

const percentile = (value) =>
  latencies[Math.min(latencies.length - 1, Math.ceil(latencies.length * value) - 1)]

const requestsPerSecond = totalRequests / (elapsedMs / 1000)
const p95 = percentile(0.95)
const p99 = percentile(0.99)

if (failures > 0 || p95 > 1000 || p99 > 2000) {
  throw new Error(
    `Carga staging fuera de presupuesto: fallos ${failures}, p95 ${p95.toFixed(1)} ms, p99 ${p99.toFixed(1)} ms.`,
  )
}

console.log(
  `Carga staging verificada: ${totalRequests} solicitudes, concurrencia ${concurrency}, ${requestsPerSecond.toFixed(1)} req/s, p95 ${p95.toFixed(1)} ms, p99 ${p99.toFixed(1)} ms, fallos ${failures}.`,
)
