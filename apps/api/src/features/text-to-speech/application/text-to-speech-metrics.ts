export const TEXT_TO_SPEECH_METRIC_NAMES = [
  'cacheHit',
  'cacheMiss',
  'generation',
  'error',
] as const

export type TextToSpeechMetricName = (typeof TEXT_TO_SPEECH_METRIC_NAMES)[number]

export type TextToSpeechMetricsSnapshot = Readonly<Record<TextToSpeechMetricName, number>>

export interface TextToSpeechMetrics {
  increment(metric: TextToSpeechMetricName): void
  snapshot(): TextToSpeechMetricsSnapshot
}

/** Contadores de proceso sin etiquetas: el contrato no admite texto ni secretos. */
export function createInMemoryTextToSpeechMetrics(): TextToSpeechMetrics {
  const counters: Record<TextToSpeechMetricName, number> = {
    cacheHit: 0,
    cacheMiss: 0,
    generation: 0,
    error: 0,
  }

  return {
    increment(metric) {
      counters[metric] += 1
    },
    snapshot() {
      return Object.freeze({ ...counters })
    },
  }
}
