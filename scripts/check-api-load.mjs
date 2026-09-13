import { performance } from 'node:perf_hooks'

import { createApp } from '../apps/api/dist/app.js'

const totalRequests = 1000
const concurrency = 25
const maximumP95Milliseconds = 750
const maximumP99Milliseconds = 1500
const maximumRssGrowthBytes = 64 * 1024 * 1024

const app = createApp({
  rateLimit: {
    maxRequests: totalRequests + 100,
    windowMs: 60_000,
  },
})
const server = app.listen(0, '127.0.0.1')

await new Promise((resolve, reject) => {
  server.once('listening', resolve)
  server.once('error', reject)
})

const address = server.address()
if (address === null || typeof address === 'string') {
  throw new Error('La API de carga no obtuvo un puerto TCP.')
}

const endpoint = 'http://127.0.0.1:' + address.port + '/api/v1/pronunciations'
const requestBody = JSON.stringify({
  text: 'hello',
  locale: 'en-US',
  modes: ['natural', 'slow', 'teacher'],
})

async function exerciseRequest() {
  const startedAt = performance.now()
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: requestBody,
  })
  await response.arrayBuffer()

  if (response.status !== 200) {
    throw new Error('La prueba de carga recibió HTTP ' + response.status + '.')
  }

  return performance.now() - startedAt
}

function percentile(values, ratio) {
  const sorted = [...values].sort((left, right) => left - right)
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * ratio) - 1)
  return sorted[index]
}

try {
  for (let index = 0; index < 20; index += 1) {
    await exerciseRequest()
  }

  const rssBefore = process.memoryUsage().rss
  const startedAt = performance.now()
  const latencies = []
  let nextRequest = 0

  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (nextRequest < totalRequests) {
        nextRequest += 1
        latencies.push(await exerciseRequest())
      }
    }),
  )

  const elapsedMilliseconds = performance.now() - startedAt
  const rssGrowthBytes = Math.max(0, process.memoryUsage().rss - rssBefore)
  const p95 = percentile(latencies, 0.95)
  const p99 = percentile(latencies, 0.99)
  const requestsPerSecond = totalRequests / (elapsedMilliseconds / 1000)

  if (
    p95 > maximumP95Milliseconds ||
    p99 > maximumP99Milliseconds ||
    rssGrowthBytes > maximumRssGrowthBytes
  ) {
    throw new Error(
      'La API excedió el presupuesto de carga: p95=' +
        p95.toFixed(1) +
        'ms, p99=' +
        p99.toFixed(1) +
        'ms, crecimiento RSS=' +
        (rssGrowthBytes / 1024 / 1024).toFixed(1) +
        'MiB.',
    )
  }

  console.log(
    'Carga API verificada: ' +
      totalRequests +
      ' solicitudes, concurrencia ' +
      concurrency +
      ', ' +
      requestsPerSecond.toFixed(1) +
      ' req/s, p95 ' +
      p95.toFixed(1) +
      ' ms, p99 ' +
      p99.toFixed(1) +
      ' ms, crecimiento RSS ' +
      (rssGrowthBytes / 1024 / 1024).toFixed(1) +
      ' MiB.',
  )
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
}
