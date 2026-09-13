import { Writable } from 'node:stream'

import { describe, expect, it } from 'vitest'

import { createLogger } from './logger.js'

describe('createLogger', () => {
  it('redacta autorización y claves antes de escribir el log', () => {
    let output = ''
    const destination = new Writable({
      write(chunk, _encoding, callback) {
        output += chunk.toString()
        callback()
      },
    })
    const logger = createLogger({ logLevel: 'info', nodeEnv: 'test' }, destination)

    logger.info({
      headers: { authorization: 'Bearer secreto' },
      openAiApiKey: 'clave-secreta',
    })

    expect(output).toContain('[REDACTED]')
    expect(output).not.toContain('Bearer secreto')
    expect(output).not.toContain('clave-secreta')
  })
})
