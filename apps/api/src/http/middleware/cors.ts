import type { RequestHandler } from 'express'

/** Autoriza únicamente orígenes completos configurados; no usa comodines. */
export function createCors(allowedOrigins: readonly string[]): RequestHandler {
  const allowed = new Set(allowedOrigins)

  return (request, response, next) => {
    const origin = request.header('origin')

    if (origin !== undefined && allowed.has(origin)) {
      response.setHeader('Access-Control-Allow-Origin', origin)
      response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
      response.setHeader('Access-Control-Allow-Headers', 'content-type')
      response.setHeader('Vary', 'Origin')
    }

    if (request.method === 'OPTIONS') {
      response.sendStatus(204)
      return
    }

    next()
  }
}
