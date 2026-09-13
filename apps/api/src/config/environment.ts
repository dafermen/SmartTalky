import { z } from 'zod'

const logLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const
const originListSchema = z.preprocess(
  (value) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((origin) => origin.trim())
          .filter((origin) => origin.length > 0)
      : value,
  z
    .array(z.url())
    .default([])
    .transform((origins) => [
      ...new Set(origins.map((origin) => new URL(origin).origin)),
    ]),
)

const environmentSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
  host: z.string().trim().min(1).default('127.0.0.1'),
  port: z.coerce.number().int().min(1).max(65_535).default(3000),
  logLevel: z.enum(logLevels).default('info'),
  openAiApiKey: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(1).optional(),
  ),
  cachedFakeProviderEnabled: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  ttsTimeoutMs: z.coerce.number().int().positive().default(30_000),
  ttsMaxRetries: z.coerce.number().int().min(0).max(3).default(1),
  educationalModel: z.string().trim().min(1).max(100).default('gpt-5.6'),
  educationalTimeoutMs: z.coerce.number().int().positive().default(20_000),
  audioCacheMaximumBytes: z.coerce
    .number()
    .int()
    .min(1024 * 1024)
    .default(512 * 1024 * 1024),
  educationalCacheMaximumEntries: z.coerce.number().int().positive().default(10_000),
  providerGenerationBudgetMaximum: z.coerce.number().int().positive().default(120),
  providerGenerationBudgetWindowMs: z.coerce.number().int().positive().default(3_600_000),
  pronunciationRateLimitMax: z.coerce.number().int().positive().default(30),
  pronunciationRateLimitWindowMs: z.coerce.number().int().positive().default(60_000),
  trustProxyHops: z.coerce.number().int().min(0).max(2).default(0),
  corsAllowedOrigins: originListSchema,
})

/** Configuración validada que puede consumir el resto de la API. */
export type AppConfig = z.infer<typeof environmentSchema>

/**
 * Valida las variables de entorno sin incluir sus valores en el mensaje de error.
 *
 * @param source Entorno a validar; se puede inyectar un objeto aislado en pruebas.
 * @returns Configuración tipada con valores predeterminados seguros para desarrollo.
 * @throws Error Si una variable conocida no cumple su contrato.
 */
export function loadConfig(source: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = environmentSchema.safeParse({
    nodeEnv: source.NODE_ENV,
    host: source.HOST,
    port: source.PORT,
    logLevel: source.LOG_LEVEL,
    openAiApiKey: source.OPENAI_API_KEY,
    cachedFakeProviderEnabled: source.CACHED_FAKE_PROVIDER_ENABLED,
    ttsTimeoutMs: source.TTS_TIMEOUT_MS,
    ttsMaxRetries: source.TTS_MAX_RETRIES,
    educationalModel: source.OPENAI_EDUCATIONAL_MODEL,
    educationalTimeoutMs: source.EDUCATIONAL_TIMEOUT_MS,
    audioCacheMaximumBytes: source.AUDIO_CACHE_MAXIMUM_BYTES,
    educationalCacheMaximumEntries: source.EDUCATIONAL_CACHE_MAXIMUM_ENTRIES,
    providerGenerationBudgetMaximum: source.PROVIDER_GENERATION_BUDGET_MAXIMUM,
    providerGenerationBudgetWindowMs: source.PROVIDER_GENERATION_BUDGET_WINDOW_MS,
    pronunciationRateLimitMax: source.PRONUNCIATION_RATE_LIMIT_MAX,
    pronunciationRateLimitWindowMs: source.PRONUNCIATION_RATE_LIMIT_WINDOW_MS,
    trustProxyHops: source.TRUST_PROXY_HOPS,
    corsAllowedOrigins:
      source.CORS_ALLOWED_ORIGINS ??
      (source.NODE_ENV === 'production'
        ? undefined
        : 'http://localhost,https://localhost'),
  })

  if (!result.success) {
    const invalidPaths = result.error.issues
      .map((issue) => issue.path.join('.') || 'configuración')
      .join(', ')

    throw new Error(`Configuración inválida en: ${invalidPaths}.`)
  }

  return result.data
}
