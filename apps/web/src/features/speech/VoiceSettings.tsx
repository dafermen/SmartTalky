import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { WebSpeechAdapter } from './web-speech-adapter'
import { useEnglishUsVoices } from './use-en-us-voices'

interface VoiceSettingsProps {
  adapter: WebSpeechAdapter
  voiceURI?: string | undefined
  onVoiceChange(voiceURI: string | undefined): void
}

export function VoiceSettings({ adapter, voiceURI, onVoiceChange }: VoiceSettingsProps) {
  const { t } = useTranslation()
  const voices = useEnglishUsVoices(adapter)
  const selectedVoiceIsAvailable =
    voiceURI === undefined || voices.some((voice) => voice.voiceURI === voiceURI)

  useEffect(() => {
    if (!selectedVoiceIsAvailable) {
      onVoiceChange(undefined)
    }
  }, [onVoiceChange, selectedVoiceIsAvailable])

  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold text-ink" htmlFor="device-voice">
        {t('settings.voiceLabel')}
      </label>
      {voices.length === 0 ? (
        <p className="m-0 rounded-card bg-surface-muted px-4 py-3 text-sm text-ink-muted">
          {t('settings.noVoices')}
        </p>
      ) : (
        <select
          id="device-voice"
          className="min-h-11 rounded-card border border-slate-300 bg-white px-3 text-ink"
          value={selectedVoiceIsAvailable ? (voiceURI ?? '') : ''}
          onChange={(event) => onVoiceChange(event.target.value || undefined)}
        >
          <option value="">{t('settings.automaticVoice')}</option>
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name}
              {voice.default ? ` · ${t('settings.defaultVoice')}` : ''}
            </option>
          ))}
        </select>
      )}
      <p className="m-0 text-xs leading-5 text-ink-muted">{t('settings.voiceHelp')}</p>
    </div>
  )
}
