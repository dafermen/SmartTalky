import pino, { type DestinationStream, type Logger, type LoggerOptions } from 'pino'

import type { AppConfig } from '../config/environment.js'

type LoggerConfig = Pick<AppConfig, 'logLevel' | 'nodeEnv'>

/** Crea las opciones de logs estructurados con rutas sensibles redactadas. */
export function createLoggerOptions(config: LoggerConfig): LoggerOptions {
  return {
    level: config.logLevel,
    base: {
      service: 'smarttalky-api',
      environment: config.nodeEnv,
    },
    redact: {
      paths: [
        'req.headers.authorization',
        'request.headers.authorization',
        'headers.authorization',
        'openAiApiKey',
        'OPENAI_API_KEY',
      ],
      censor: '[REDACTED]',
    },
  }
}

/** Construye el logger; el destino inyectable permite verificar redacción sin consola. */
export function createLogger(
  config: LoggerConfig,
  destination?: DestinationStream,
): Logger {
  const options = createLoggerOptions(config)
  return destination === undefined ? pino(options) : pino(options, destination)
}
