interface ManualTtsConfig {
  apiKey: string
}

/** Exige dos decisiones explícitas; nunca devuelve ni registra la clave. */
export function loadManualTtsConfig(
  source: NodeJS.ProcessEnv = process.env,
): ManualTtsConfig {
  if (source.SMARTTALKY_RUN_PAID_TTS !== 'true') {
    throw new Error(
      'Prueba TTS bloqueada: configure SMARTTALKY_RUN_PAID_TTS=true de forma explícita.',
    )
  }

  const apiKey = source.OPENAI_API_KEY?.trim()
  if (apiKey === undefined || apiKey === '') {
    throw new Error('Prueba TTS bloqueada: falta OPENAI_API_KEY.')
  }

  return { apiKey }
}
