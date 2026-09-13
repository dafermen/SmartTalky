import { expect, test } from '@playwright/test'

test('staging conserva HTTPS, defensas, audio y claves estables', async ({ request }) => {
  const home = await request.get('/')
  expect(home.ok()).toBeTruthy()
  expect(home.headers()['strict-transport-security']).toContain('max-age=')
  expect(home.headers()['content-security-policy']).toContain("default-src 'self'")
  expect(home.headers()['x-content-type-options']).toBe('nosniff')

  const payload = {
    text: 'hello',
    locale: 'en-US',
    modes: ['natural', 'slow', 'teacher'],
  }
  const first = await request.post('/api/v1/pronunciations', { data: payload })
  const second = await request.post('/api/v1/pronunciations', { data: payload })
  expect(first.ok()).toBeTruthy()
  expect(second.ok()).toBeTruthy()

  const firstBody = await first.json()
  const secondBody = await second.json()
  expect(firstBody.audio).toHaveLength(3)
  expect(secondBody.audio.map(({ key }) => key)).toEqual(
    firstBody.audio.map(({ key }) => key),
  )

  for (const audio of firstBody.audio) {
    const response = await request.get(`/api/v1/audio/${audio.key}`)
    expect(response.ok()).toBeTruthy()
    expect(response.headers()['content-type']).toContain('audio/wav')
    expect((await response.body()).byteLength).toBeGreaterThan(40)
  }

  const foreignOrigin = await request.post('/api/v1/pronunciations', {
    data: payload,
    headers: { Origin: 'https://example.invalid' },
  })
  expect(foreignOrigin.headers()['access-control-allow-origin']).toBeUndefined()
})
