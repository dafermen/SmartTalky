/** Error operativo que puede traducirse de manera segura a una respuesta HTTP. */
export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number

  public constructor(code: string, message: string, statusCode: number) {
    super(message)
    this.name = new.target.name
    this.code = code
    this.statusCode = statusCode
  }
}

/** Indica que la ruta solicitada no forma parte del contrato público. */
export class NotFoundError extends AppError {
  public constructor() {
    super('RESOURCE_NOT_FOUND', 'El recurso solicitado no existe.', 404)
  }
}

/** Indica que una solicitud no satisface el contrato público. */
export class InvalidRequestError extends AppError {
  public constructor() {
    super('INVALID_REQUEST', 'La solicitud no es válida.', 400)
  }
}

/** Rechaza cuerpos excesivos antes de que alcancen los casos de uso. */
export class PayloadTooLargeError extends AppError {
  public constructor() {
    super('PAYLOAD_TOO_LARGE', 'La solicitud supera el tamaño permitido.', 413)
  }
}

/** Evita distinguir entre una clave de audio inválida y una inexistente. */
export class AudioNotFoundError extends AppError {
  public constructor() {
    super('AUDIO_NOT_FOUND', 'El audio solicitado no existe.', 404)
  }
}

/** Limita solicitudes repetidas sin revelar reglas internas ni datos del cliente. */
export class RateLimitExceededError extends AppError {
  public constructor() {
    super(
      'RATE_LIMIT_EXCEEDED',
      'Hay demasiadas solicitudes. Inténtelo de nuevo más tarde.',
      429,
    )
  }
}
