import type { PronunciationProvider } from '../application/get-pronunciation.js'
import {
  toPronunciationAudio,
  type GetOrCreateSpeech,
} from '../../text-to-speech/application/get-or-create-speech.js'

function createTeacherSequence(
  text: string,
  syllables: readonly { text: string }[] | undefined,
): string {
  const segments =
    syllables
      ?.map((syllable) => syllable.text.trim())
      .filter((segment) => segment.length > 0) ?? []
  const middle = segments.length > 1 ? segments : [text]

  return [text, ...middle, text].join('. ') + '.'
}

/** Combina contenido educativo con audio cacheado sin mover reglas a HTTP. */
export function createCachingPronunciationProvider(
  educationalProvider: PronunciationProvider,
  getOrCreateSpeech: GetOrCreateSpeech,
): PronunciationProvider {
  return {
    async lookup(request) {
      const educational = await educationalProvider.lookup({ ...request, modes: [] })
      const generated = await Promise.all(
        request.modes.map((mode) =>
          getOrCreateSpeech({
            text:
              mode === 'teacher'
                ? createTeacherSequence(
                    educational.pronunciation.text,
                    educational.pronunciation.syllables,
                  )
                : request.text,
            locale: request.locale,
            mode,
          }),
        ),
      )

      return {
        pronunciation: educational.pronunciation,
        audio: generated.map(({ entry }) => toPronunciationAudio(entry)),
      }
    },
  }
}
