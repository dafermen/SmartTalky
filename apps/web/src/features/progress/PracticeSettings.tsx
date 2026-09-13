import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

import type { WebSpeechAdapter } from '../speech/web-speech-adapter'
import { VoiceSettings } from '../speech/VoiceSettings'
import {
  PRACTICE_RATES,
  type LocalProgressStore,
  type PracticePreferences,
} from './local-progress-store'

interface PracticeSettingsProps {
  adapter: WebSpeechAdapter
  store: LocalProgressStore
}

export function PracticeSettings({ adapter, store }: PracticeSettingsProps) {
  const { t } = useTranslation()
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  )
  const update = (next: Partial<PracticePreferences>) => store.updatePreferences(next)

  return (
    <div className="grid gap-4">
      <VoiceSettings
        adapter={adapter}
        voiceURI={state.preferences.voiceURI}
        onVoiceChange={(voiceURI) => update({ voiceURI })}
      />
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <label className="grid gap-2 text-sm font-bold text-ink">
          {t('settings.rateLabel')}
          <select
            className="min-h-11 rounded-card border border-slate-300 bg-white px-3 font-normal text-ink"
            value={state.preferences.rate}
            onChange={(event) =>
              update({ rate: Number(event.target.value) as PracticePreferences['rate'] })
            }
          >
            {PRACTICE_RATES.map((rate) => (
              <option key={rate} value={rate}>
                {t(`settings.rate${String(rate).replace('.', '')}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          {t('settings.modeLabel')}
          <select
            className="min-h-11 rounded-card border border-slate-300 bg-white px-3 font-normal text-ink"
            value={state.preferences.mode}
            onChange={(event) =>
              update({ mode: event.target.value as PracticePreferences['mode'] })
            }
          >
            <option value="natural">{t('pronunciation.natural')}</option>
            <option value="slow">{t('pronunciation.slow')}</option>
            <option value="teacher">{t('pronunciation.teacher')}</option>
          </select>
        </label>
      </div>
    </div>
  )
}
