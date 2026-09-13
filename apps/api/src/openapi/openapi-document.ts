export const pronunciationRequestExample = {
  text: 'comfortable',
  locale: 'en-US',
  modes: ['natural', 'slow', 'teacher'],
} as const

export const pronunciationResponseExample = {
  pronunciation: {
    text: 'comfortable',
    kind: 'word',
    locale: 'en-US',
    ipa: '/ˈkʌm.fɚ.t̬ə.bəl/',
    syllables: [
      { text: 'com', stressed: true },
      { text: 'fort', stressed: false },
      { text: 'a', stressed: false },
      { text: 'ble', stressed: false },
    ],
    translation: 'cómodo o cómoda',
    example: 'These shoes are very comfortable.',
  },
  audio: [
    {
      key: 'mock-natural',
      mode: 'natural',
      mimeType: 'audio/wav',
      byteLength: 44,
    },
  ],
} as const

const errorSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['error'],
  properties: {
    error: {
      type: 'object',
      additionalProperties: false,
      required: ['code', 'message', 'requestId'],
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
        requestId: { type: 'string' },
      },
    },
  },
} as const

/** Contrato OpenAPI 3.1 mantenido junto a las rutas que describe. */
export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'SmartTalky API',
    version: '0.1.0',
    description: 'API educativa de pronunciación. El proveedor actual es simulado.',
  },
  servers: [{ url: 'http://127.0.0.1:3000' }],
  paths: {
    '/api/v1/health': {
      get: {
        operationId: 'getHealth',
        summary: 'Consultar salud básica',
        responses: {
          '200': {
            description: 'Servicio disponible',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/pronunciations': {
      post: {
        operationId: 'createPronunciation',
        summary: 'Obtener pronunciación educativa y audio simulado',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PronunciationRequest' },
              example: pronunciationRequestExample,
            },
          },
        },
        responses: {
          '200': {
            description: 'Pronunciación preparada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PronunciationResponse' },
                example: pronunciationResponseExample,
              },
            },
          },
          '400': {
            description: 'Solicitud inválida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Error interno seguro',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/audio/{key}': {
      get: {
        operationId: 'getAudio',
        summary: 'Descargar audio por clave opaca',
        parameters: [
          {
            name: 'key',
            in: 'path',
            required: true,
            schema: { type: 'string', pattern: '^[a-z0-9][a-z0-9-]{0,63}$' },
          },
        ],
        responses: {
          '200': {
            description: 'Bytes de audio',
            headers: {
              'X-Content-Type-Options': {
                schema: { type: 'string', const: 'nosniff' },
              },
            },
            content: {
              'audio/wav': { schema: { type: 'string', format: 'binary' } },
              'audio/mpeg': { schema: { type: 'string', format: 'binary' } },
            },
          },
          '404': {
            description: 'Audio ausente o clave inválida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['status', 'service'],
        properties: {
          status: { type: 'string', const: 'ok' },
          service: { type: 'string', const: 'smarttalky-api' },
        },
      },
      PronunciationMode: { type: 'string', enum: ['natural', 'slow', 'teacher'] },
      PronunciationRequest: {
        type: 'object',
        additionalProperties: false,
        required: ['text', 'locale', 'modes'],
        properties: {
          text: { type: 'string', minLength: 1, maxLength: 120 },
          locale: { type: 'string', const: 'en-US' },
          modes: {
            type: 'array',
            minItems: 1,
            maxItems: 3,
            items: { $ref: '#/components/schemas/PronunciationMode' },
          },
        },
      },
      PronunciationSyllable: {
        type: 'object',
        additionalProperties: false,
        required: ['text', 'stressed'],
        properties: {
          text: { type: 'string', minLength: 1 },
          stressed: { type: 'boolean' },
        },
      },
      PronunciationEntry: {
        type: 'object',
        additionalProperties: false,
        required: ['text', 'kind', 'locale'],
        properties: {
          text: { type: 'string', minLength: 1, maxLength: 120 },
          kind: { type: 'string', enum: ['word', 'phrase'] },
          locale: { type: 'string', const: 'en-US' },
          ipa: { type: 'string', minLength: 1 },
          syllables: {
            type: 'array',
            items: { $ref: '#/components/schemas/PronunciationSyllable' },
          },
          translation: { type: 'string', minLength: 1 },
          example: { type: 'string', minLength: 1 },
        },
      },
      PronunciationAudio: {
        type: 'object',
        additionalProperties: false,
        required: ['key', 'mode', 'mimeType', 'byteLength'],
        properties: {
          key: { type: 'string', minLength: 1 },
          mode: { $ref: '#/components/schemas/PronunciationMode' },
          mimeType: { type: 'string', enum: ['audio/mpeg', 'audio/wav'] },
          byteLength: { type: 'integer', minimum: 0 },
          durationMs: { type: 'integer', minimum: 1 },
        },
      },
      PronunciationResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['pronunciation', 'audio'],
        properties: {
          pronunciation: { $ref: '#/components/schemas/PronunciationEntry' },
          audio: {
            type: 'array',
            items: { $ref: '#/components/schemas/PronunciationAudio' },
          },
        },
      },
      ErrorResponse: errorSchema,
    },
  },
} as const
