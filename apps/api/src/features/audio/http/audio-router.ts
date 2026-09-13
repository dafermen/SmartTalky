import { Router } from 'express'

import { AudioNotFoundError } from '../../../domain/errors/app-error.js'
import type { GetAudio } from '../application/get-audio.js'

const CONTROLLED_AUDIO_KEY = /^[a-z0-9][a-z0-9-]{0,63}$/

interface AudioRouterDependencies {
  getAudio: GetAudio
}

/** Sirve bytes solo después de validar una clave opaca y resolverla en el caso de uso. */
export function createAudioRouter({ getAudio }: AudioRouterDependencies): Router {
  const router = Router()

  router.get('/:key', async (request, response, next) => {
    try {
      const key = request.params.key

      if (key === undefined || !CONTROLLED_AUDIO_KEY.test(key)) {
        throw new AudioNotFoundError()
      }

      const asset = await getAudio(key)
      response.setHeader('content-type', asset.mimeType)
      response.setHeader('content-length', String(asset.bytes.byteLength))
      response.setHeader('x-content-type-options', 'nosniff')
      response.status(200).send(Buffer.from(asset.bytes))
    } catch (error) {
      next(error)
    }
  })

  return router
}
