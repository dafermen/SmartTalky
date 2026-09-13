import { useEffect, useState } from 'react'

import type { WebSpeechAdapter, WebSpeechVoice } from './web-speech-adapter'

function readEnglishUsVoices(adapter: WebSpeechAdapter): readonly WebSpeechVoice[] {
  return adapter
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase() === 'en-us')
    .sort((left, right) => {
      if (left.default !== right.default) {
        return left.default ? -1 : 1
      }
      return left.name.localeCompare(right.name)
    })
}

/** Mantiene una lista reactiva porque algunos navegadores cargan sus voces después. */
export function useEnglishUsVoices(adapter: WebSpeechAdapter) {
  const [voices, setVoices] = useState(() => readEnglishUsVoices(adapter))

  useEffect(() => {
    const refresh = () => setVoices(readEnglishUsVoices(adapter))
    refresh()
    return adapter.subscribeToVoiceChanges(refresh)
  }, [adapter])

  return voices
}
