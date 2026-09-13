import { describe, expect, it } from 'vitest'

import {
  createInMemoryTextToSpeechMetrics,
  TEXT_TO_SPEECH_METRIC_NAMES,
} from './text-to-speech-metrics.js'

describe('métricas TTS', () => {
  it('cuenta únicamente eventos técnicos conocidos', () => {
    const metrics = createInMemoryTextToSpeechMetrics()

    for (const name of TEXT_TO_SPEECH_METRIC_NAMES) {
      metrics.increment(name)
    }
    metrics.increment('cacheHit')

    expect(metrics.snapshot()).toEqual({
      cacheHit: 2,
      cacheMiss: 1,
      generation: 1,
      error: 1,
    })
  })

  it('devuelve snapshots congelados y desacoplados', () => {
    const metrics = createInMemoryTextToSpeechMetrics()
    const first = metrics.snapshot()
    metrics.increment('generation')

    expect(Object.isFrozen(first)).toBe(true)
    expect(first.generation).toBe(0)
    expect(metrics.snapshot().generation).toBe(1)
  })
})
