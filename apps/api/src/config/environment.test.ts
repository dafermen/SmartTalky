import { describe, expect, it } from 'vitest'

import { loadConfig } from './environment.js'

describe('loadConfig', () => {
  it('aplica valores seguros cuando no se proporcionan variables', () => {
    expect(loadConfig({})).toEqual({
      nodeEnv: 'development',
      host: '127.0.0.1',
      port: 3000,
      logLevel: 'info',
      openAiApiKey: undefined,
      ttsTimeoutMs: 30000,
      ttsMaxRetries: 1,
      educationalModel: 'gpt-5.6',
      educationalTimeoutMs: 20000,
      audioCacheMaximumBytes: 536870912,
      educationalCacheMaximumEntries: 10000,
      providerGenerationBudgetMaximum: 120,
      providerGenerationBudgetWindowMs: 3600000,
      pronunciationRateLimitMax: 30,
      pronunciationRateLimitWindowMs: 60000,
      trustProxyHops: 0,
      corsAllowedOrigins: ['http://localhost', 'https://localhost'],
    })
  })

  it('convierte y valida una configuración explícita', () => {
    expect(
      loadConfig({
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: '8080',
        LOG_LEVEL: 'warn',
        OPENAI_API_KEY: 'clave-solo-para-prueba',
        TTS_TIMEOUT_MS: '15000',
        TTS_MAX_RETRIES: '2',
        OPENAI_EDUCATIONAL_MODEL: 'modelo-educativo',
        EDUCATIONAL_TIMEOUT_MS: '12000',
        AUDIO_CACHE_MAXIMUM_BYTES: '1048576',
        EDUCATIONAL_CACHE_MAXIMUM_ENTRIES: '200',
        PROVIDER_GENERATION_BUDGET_MAXIMUM: '40',
        PROVIDER_GENERATION_BUDGET_WINDOW_MS: '1800000',
        PRONUNCIATION_RATE_LIMIT_MAX: '10',
        PRONUNCIATION_RATE_LIMIT_WINDOW_MS: '30000',
        TRUST_PROXY_HOPS: '2',
        CORS_ALLOWED_ORIGINS: 'http://localhost, https://app.smarttalky.example/',
      }),
    ).toEqual({
      nodeEnv: 'production',
      host: '0.0.0.0',
      port: 8080,
      logLevel: 'warn',
      openAiApiKey: 'clave-solo-para-prueba',
      ttsTimeoutMs: 15000,
      ttsMaxRetries: 2,
      educationalModel: 'modelo-educativo',
      educationalTimeoutMs: 12000,
      audioCacheMaximumBytes: 1048576,
      educationalCacheMaximumEntries: 200,
      providerGenerationBudgetMaximum: 40,
      providerGenerationBudgetWindowMs: 1800000,
      pronunciationRateLimitMax: 10,
      pronunciationRateLimitWindowMs: 30000,
      trustProxyHops: 2,
      corsAllowedOrigins: ['http://localhost', 'https://app.smarttalky.example'],
    })
  })

  it('trata una clave vacía como proveedor no configurado', () => {
    expect(loadConfig({ OPENAI_API_KEY: '   ' }).openAiApiKey).toBeUndefined()
  })

  it('rechaza un puerto fuera del rango TCP sin filtrar el entorno completo', () => {
    expect(() => loadConfig({ PORT: '70000' })).toThrow(
      'Configuración inválida en: port.',
    )
  })

  it('rechaza políticas TTS o rate limit fuera de rango', () => {
    expect(() => loadConfig({ TTS_TIMEOUT_MS: '0' })).toThrow('ttsTimeoutMs')
    expect(() => loadConfig({ TTS_MAX_RETRIES: '4' })).toThrow('ttsMaxRetries')
    expect(() => loadConfig({ EDUCATIONAL_TIMEOUT_MS: '0' })).toThrow(
      'educationalTimeoutMs',
    )
    expect(() => loadConfig({ PRONUNCIATION_RATE_LIMIT_MAX: '0' })).toThrow(
      'pronunciationRateLimitMax',
    )
    expect(() => loadConfig({ AUDIO_CACHE_MAXIMUM_BYTES: '100' })).toThrow(
      'audioCacheMaximumBytes',
    )
    expect(() => loadConfig({ PROVIDER_GENERATION_BUDGET_MAXIMUM: '0' })).toThrow(
      'providerGenerationBudgetMaximum',
    )
    expect(() => loadConfig({ TRUST_PROXY_HOPS: '3' })).toThrow('trustProxyHops')
  })

  it('no habilita CORS implícitamente en producción', () => {
    expect(loadConfig({ NODE_ENV: 'production' }).corsAllowedOrigins).toEqual([])
  })

  it('rechaza un origen CORS inválido sin mostrar el entorno completo', () => {
    expect(() => loadConfig({ CORS_ALLOWED_ORIGINS: 'no-es-url' })).toThrow(
      'corsAllowedOrigins',
    )
  })
})
