import { pronunciationRequestSchema } from '@smarttalky/shared'
import { Router } from 'express'

import { InvalidRequestError } from '../../../domain/errors/app-error.js'
import type { LookupPronunciation } from '../application/get-pronunciation.js'

interface PronunciationRouterDependencies {
  lookupPronunciation: LookupPronunciation
}

/** Traduce HTTP al caso de uso sin incorporar reglas del proveedor. */
export function createPronunciationRouter({
  lookupPronunciation,
}: PronunciationRouterDependencies): Router {
  const router = Router()

  router.post('/', async (request, response, next) => {
    try {
      const parsedRequest = pronunciationRequestSchema.safeParse(request.body)

      if (!parsedRequest.success) {
        throw new InvalidRequestError()
      }

      const result = await lookupPronunciation(parsedRequest.data)
      response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  })

  return router
}
