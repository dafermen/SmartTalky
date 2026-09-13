import { Router } from 'express'

export const healthRouter = Router()

/** Informa disponibilidad básica sin revelar configuración o dependencias internas. */
healthRouter.get('/', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    service: 'smarttalky-api',
  })
})
