import type { RequestHandler } from 'express'

/** Endurece respuestas API sin asumir el proveedor de hosting de la web. */
export const securityHeaders: RequestHandler = (_request, response, next) => {
  response.setHeader(
    'content-security-policy',
    "default-src 'none'; frame-ancestors 'none'",
  )
  response.setHeader('permissions-policy', 'camera=(), microphone=(), geolocation=()')
  response.setHeader('referrer-policy', 'no-referrer')
  response.setHeader('x-content-type-options', 'nosniff')
  response.setHeader('x-frame-options', 'DENY')
  next()
}
