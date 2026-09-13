import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { createOpenAiTextToSpeechProvider } from '../features/text-to-speech/infrastructure/openai-text-to-speech-provider.js'
import { loadManualTtsConfig } from './manual-tts-guard.js'

async function main(): Promise<void> {
  const { apiKey } = loadManualTtsConfig()
  const directory = await mkdtemp(path.join(tmpdir(), 'smarttalky-manual-tts-'))
  const outputPath = path.join(directory, 'verification.wav')

  console.warn(
    'Se realizará una solicitud TTS real que puede generar costo. El audio temporal se eliminará al terminar.',
  )

  try {
    const result = await createOpenAiTextToSpeechProvider({ apiKey }).synthesize({
      text: 'hello',
      locale: 'en-US',
      mode: 'natural',
    })
    await writeFile(outputPath, result.bytes)
    console.info(
      `Prueba TTS correcta: ${result.bytes.byteLength} bytes WAV, modelo ${result.metadata.model}.`,
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

await main()
