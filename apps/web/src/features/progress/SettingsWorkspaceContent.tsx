import { Card } from '@smarttalky/ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { createWebSpeechAdapter } from '../speech/web-speech-adapter'
import { DataControls } from './DataControls'
import type { LocalProgressStore } from './local-progress-store'
import { PracticeSettings } from './PracticeSettings'

export function SettingsWorkspaceContent({ store }: { store: LocalProgressStore }) {
  const { t } = useTranslation()
  const adapter = useMemo(() => createWebSpeechAdapter(), [])

  return (
    <div className="border-t border-border bg-surface p-3 sm:p-4">
      <Card className="grid content-start gap-4 p-5 sm:p-7">
        <div>
          <h3 className="m-0 text-xl font-black">{t('settings.title')}</h3>
          <p className="mb-0 mt-1 text-sm leading-6 text-ink-muted">
            {t('settings.description')}
          </p>
        </div>
        <PracticeSettings adapter={adapter} store={store} />
        <DataControls store={store} />
      </Card>
    </div>
  )
}
