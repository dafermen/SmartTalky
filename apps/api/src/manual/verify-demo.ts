import assert from 'node:assert/strict'
import { createServer } from 'node:http'

import { pronunciationResponseSchema } from '@smarttalky/shared'

import { createApp } from '../app.js'
import { FAKE_WAV_BYTES } from '../features/audio/infrastructure/fake-wav.js'

const server = createServer(createApp())

try {
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  assert(address !== null && typeof address === 'object')
  const baseUrl = `http://127.0.0.1:${address.port}`

  const healthResponse = await fetch(`${baseUrl}/api/v1/health`)
  assert.equal(healthResponse.status, 200)
  assert.deepEqual(await healthResponse.json(), {
    status: 'ok',
    service: 'smarttalky-api',
  })

  const pronunciationResponse = await fetch(`${baseUrl}/api/v1/pronunciations`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      text: 'comfortable',
      locale: 'en-US',
      modes: ['natural', 'slow', 'teacher'],
    }),
  })
  assert.equal(pronunciationResponse.status, 200)
  const result = pronunciationResponseSchema.parse(await pronunciationResponse.json())
  assert.equal(result.pronunciation.text, 'comfortable')
  assert.equal(result.pronunciation.translation, 'cómodo o cómoda')
  assert.equal(result.audio.length, 3)

  const naturalAudio = result.audio.find((audio) => audio.mode === 'natural')
  assert(naturalAudio !== undefined)
  const audioResponse = await fetch(
    `${baseUrl}/api/v1/audio/${encodeURIComponent(naturalAudio.key)}`,
  )
  assert.equal(audioResponse.status, 200)
  assert.equal(audioResponse.headers.get('content-type'), 'audio/wav')
  assert.equal(audioResponse.headers.get('x-content-type-options'), 'nosniff')
  assert.equal((await audioResponse.arrayBuffer()).byteLength, FAKE_WAV_BYTES.byteLength)

  console.log('Demo verificada: salud, guía comfortable y audio simulado accesibles.')
} finally {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error === undefined ? resolve() : reject(error)))
  })
}
