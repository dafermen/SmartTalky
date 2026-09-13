import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { LocalProgressStore } from './local-progress-store'

const HistoryWorkspaceContent = lazy(() =>
  import('./HistoryWorkspaceContent').then((module) => ({
    default: module.HistoryWorkspaceContent,
  })),
)
const SettingsWorkspaceContent = lazy(() =>
  import('./SettingsWorkspaceContent').then((module) => ({
    default: module.SettingsWorkspaceContent,
  })),
)

function PanelFallback() {
  const { t } = useTranslation()
  return (
    <p
      className="m-0 border-t border-border bg-surface p-5 text-sm text-ink-muted"
      role="status"
    >
      {t('navigation.loadingPage')}
    </p>
  )
}

export function PracticeWorkspace({ store }: { store: LocalProgressStore }) {
  const { t } = useTranslation()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <section className="mt-10" aria-labelledby="practice-workspace-title">
      <div className="mb-4">
        <h2 id="practice-workspace-title" className="m-0 text-2xl font-black">
          {t('home.workspaceTitle')}
        </h2>
        <p className="mb-0 mt-1 leading-6 text-ink-muted">
          {t('home.workspaceDescription')}
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <details
          className="group rounded-card border border-border bg-surface-raised shadow-card"
          onToggle={(event) => setHistoryOpen(event.currentTarget.open)}
        >
          <summary className="flex min-h-24 list-none items-center justify-between gap-4 rounded-card px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
            <span>
              <strong className="block text-lg">{t('home.historyPanel')}</strong>
              <span className="mt-1 block text-sm leading-5 text-ink-muted">
                {t('home.historyPanelDescription')}
              </span>
            </span>
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-xl font-bold text-brand-primary transition-transform group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          {historyOpen ? (
            <Suspense fallback={<PanelFallback />}>
              <HistoryWorkspaceContent store={store} />
            </Suspense>
          ) : null}
        </details>
        <details
          className="group rounded-card border border-border bg-surface-raised shadow-card"
          onToggle={(event) => setSettingsOpen(event.currentTarget.open)}
        >
          <summary className="flex min-h-24 list-none items-center justify-between gap-4 rounded-card px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
            <span>
              <strong className="block text-lg">{t('home.settingsPanel')}</strong>
              <span className="mt-1 block text-sm leading-5 text-ink-muted">
                {t('home.settingsPanelDescription')}
              </span>
            </span>
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-soft text-xl font-bold text-brand-secondary transition-transform group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          {settingsOpen ? (
            <Suspense fallback={<PanelFallback />}>
              <SettingsWorkspaceContent store={store} />
            </Suspense>
          ) : null}
        </details>
      </div>
    </section>
  )
}
