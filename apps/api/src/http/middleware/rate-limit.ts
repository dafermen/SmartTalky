import type { RequestHandler } from 'express'

import { RateLimitExceededError } from '../../domain/errors/app-error.js'

interface RateLimitOptions {
  maxRequests: number
  windowMs: number
  now?: (() => number) | undefined
}

interface ClientWindow {
  count: number
  resetAt: number
}

/** Límite en memoria por IP; no registra cuerpo, texto ni encabezados. */
export function createRateLimit(options: RateLimitOptions): RequestHandler {
  if (options.maxRequests < 1 || options.windowMs < 1) {
    throw new Error('La configuración de rate limit no es válida.')
  }
  const now = options.now ?? Date.now
  const clients = new Map<string, ClientWindow>()

  return (request, response, next) => {
    const timestamp = now()
    const key = request.ip ?? 'unknown'
    const current = clients.get(key)
    const window =
      current === undefined || timestamp >= current.resetAt
        ? { count: 0, resetAt: timestamp + options.windowMs }
        : current

    window.count += 1
    clients.set(key, window)
    response.setHeader(
      'x-ratelimit-remaining',
      String(Math.max(0, options.maxRequests - window.count)),
    )

    if (window.count > options.maxRequests) {
      response.setHeader(
        'retry-after',
        String(Math.max(1, Math.ceil((window.resetAt - timestamp) / 1000))),
      )
      next(new RateLimitExceededError())
      return
    }

    next()
  }
}
