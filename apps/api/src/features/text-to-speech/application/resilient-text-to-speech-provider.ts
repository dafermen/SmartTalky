import {
  TextToSpeechProviderError,
  type TextToSpeechProvider,
} from './text-to-speech-provider.js'

interface TextToSpeechResilienceOptions {
  timeoutMs: number
  maxRetries: number
  retryDelayMs?: number | undefined
  sleep?: ((milliseconds: number) => Promise<void>) | undefined
}

function validateOptions(options: TextToSpeechResilienceOptions): void {
  if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new Error('El timeout TTS debe ser positivo.')
  }
  if (!Number.isInteger(options.maxRetries) || options.maxRetries < 0) {
    throw new Error('La cantidad de reintentos TTS no es válida.')
  }
}

/** Aplica timeout y reintentos acotados sin incorporar reglas de un SDK concreto. */
export function createResilientTextToSpeechProvider(
  provider: TextToSpeechProvider,
  options: TextToSpeechResilienceOptions,
): TextToSpeechProvider {
  validateOptions(options)
  const retryDelayMs = options.retryDelayMs ?? 100
  const sleep =
    options.sleep ??
    ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)))

  return {
    async synthesize(request, callerSignal) {
      for (let attempt = 0; ; attempt += 1) {
        const controller = new AbortController()
        let timedOut = false
        const onCallerAbort = () => controller.abort(callerSignal?.reason)
        callerSignal?.addEventListener('abort', onCallerAbort, { once: true })
        if (callerSignal?.aborted === true) {
          controller.abort(callerSignal.reason)
        }
        const timeout = setTimeout(() => {
          timedOut = true
          controller.abort('tts-timeout')
        }, options.timeoutMs)

        try {
          return await provider.synthesize(request, controller.signal)
        } catch (error) {
          const failure = timedOut
            ? new TextToSpeechProviderError(
                'REQUEST_FAILED',
                'El proveedor TTS excedió el tiempo permitido.',
                { retryable: true },
              )
            : error

          if (
            callerSignal?.aborted === true ||
            !(failure instanceof TextToSpeechProviderError) ||
            !failure.retryable ||
            attempt >= options.maxRetries
          ) {
            throw failure
          }

          if (retryDelayMs > 0) {
            await sleep(retryDelayMs)
          }
        } finally {
          clearTimeout(timeout)
          callerSignal?.removeEventListener('abort', onCallerAbort)
        }
      }
    },
  }
}
