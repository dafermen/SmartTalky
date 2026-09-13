import { Card } from '@smarttalky/ui'
import { useMutation } from '@tanstack/react-query'
import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

import { PracticeForm } from '../features/practice/PracticeForm'
import { PronunciationCard } from '../features/practice/PronunciationCard'
import { lookupApiPronunciation } from '../features/practice/pronunciation-api'
import type { LookupPronunciation, PlayPronunciation } from '../features/practice/types'
import {
  localProgressStore,
  type LocalProgressStore,
} from '../features/progress/local-progress-store'
import { playPronunciation as playPronunciationWithFallback } from '../features/speech/pronunciation-player'

const PracticeWorkspace = lazy(() =>
  import('../features/progress/PracticeWorkspace').then((module) => ({
    default: module.PracticeWorkspace,
  })),
)

interface HomePageProps {
  lookupPronunciation?: LookupPronunciation
  playPronunciation?: PlayPronunciation
  progressStore?: LocalProgressStore
}

/** Pantalla principal que coordina formulario y estado remoto mediante TanStack Query. */
export function HomePage({
  lookupPronunciation = lookupApiPronunciation,
  playPronunciation,
  progressStore = localProgressStore,
}: HomePageProps) {
  const { t } = useTranslation()
  const progressState = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getSnapshot,
  )
  const activeController = useRef<AbortController | undefined>(undefined)
  const resultRef = useRef<HTMLDivElement>(null)
  const [resetRequestId, setResetRequestId] = useState(0)
  const lookupMutation = useMutation({
    mutationKey: ['pronunciation'],
    mutationFn: async (text: string) => {
      activeController.current?.abort()
      const controller = new AbortController()
      activeController.current = controller

      try {
        return await lookupPronunciation(text, controller.signal)
      } finally {
        if (activeController.current === controller) {
          activeController.current = undefined
        }
      }
    },
    onSuccess: (result) => progressStore.recordHistory(result.entry.text),
  })

  useEffect(
    () => () => {
      activeController.current?.abort()
    },
    [],
  )

  useEffect(() => {
    if (!lookupMutation.isSuccess) {
      return
    }

    resultRef.current?.focus({ preventScroll: true })
    resultRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }, [lookupMutation.isSuccess])

  const submit = async (text: string) => {
    try {
      await lookupMutation.mutateAsync(text)
    } catch {
      // TanStack Query conserva el error para presentar un estado recuperable.
    }
  }

  const practiceAnother = () => {
    lookupMutation.reset()
    setResetRequestId((current) => current + 1)
  }

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border bg-surface-raised">
        <div
          className="absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-brand-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-36 -left-24 -z-10 size-72 rounded-full bg-brand-secondary/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="m-0 text-sm font-black uppercase tracking-[0.16em] text-brand-primary">
              {t('home.eyebrow')}
            </p>
            <h1 className="mb-0 mt-4 text-4xl font-black leading-[1.08] tracking-tight text-balance sm:text-5xl">
              {t('home.title')}
            </h1>
            <p className="mb-0 mt-5 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl">
              {t('home.description')}
            </p>
            <span className="mt-6 inline-flex rounded-full bg-secondary-soft px-4 py-2 text-sm font-bold text-brand-secondary">
              {t('home.localeBadge')}
            </span>
          </div>
          <PracticeForm
            isLoading={lookupMutation.isPending}
            onSubmit={submit}
            resetRequestId={resetRequestId}
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {lookupMutation.isIdle ? (
          <Card className="border-brand-primary/10 p-5 sm:p-7">
            <h2 className="m-0 text-center text-lg font-black">
              {t('home.journeyTitle')}
            </h2>
            <ol className="mt-5 grid list-none gap-3 p-0 sm:grid-cols-3">
              {(['Write', 'Listen', 'Repeat'] as const).map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-card bg-surface-muted p-4"
                >
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-black text-brand-primary"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span>
                    <strong className="block">{t(`home.journey${step}`)}</strong>
                    <span className="mt-1 block text-sm leading-5 text-ink-muted">
                      {t(`home.journey${step}Description`)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        ) : null}

        {lookupMutation.isPending ? (
          <Card className="grid gap-5 p-6 sm:p-8" aria-busy="true" aria-live="polite">
            <span className="font-bold text-brand-primary">{t('home.loading')}</span>
            <div
              className="h-8 w-2/3 animate-pulse rounded bg-slate-200"
              aria-hidden="true"
            />
            <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
              <div className="h-28 animate-pulse rounded-card bg-slate-100" />
              <div className="h-28 animate-pulse rounded-card bg-slate-100" />
            </div>
          </Card>
        ) : null}

        {lookupMutation.isError ? (
          <Card className="border-error-ink/20 bg-error-surface p-6" role="alert">
            <h2 className="m-0 text-xl font-black text-error-ink">
              {t('home.errorTitle')}
            </h2>
            <p className="mb-0 mt-2 text-error-ink">{t('home.errorDescription')}</p>
          </Card>
        ) : null}

        {lookupMutation.isSuccess ? (
          <div ref={resultRef} className="scroll-mt-24 focus:outline-none" tabIndex={-1}>
            <PronunciationCard
              entry={lookupMutation.data.entry}
              progressStore={progressStore}
              playPronunciation={
                playPronunciation ??
                ((mode) =>
                  playPronunciationWithFallback({
                    text: lookupMutation.data.entry.text,
                    mode,
                    audio: lookupMutation.data.audio,
                    rate: progressState.preferences.rate,
                    segments: lookupMutation.data.entry.syllables?.map(
                      (syllable) => syllable.text,
                    ),
                    voiceURI: progressState.preferences.voiceURI,
                  }))
              }
            />
            <button
              type="button"
              className="mx-auto mt-5 flex min-h-11 items-center rounded-control border border-brand-primary bg-white px-5 font-black text-brand-primary hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              onClick={practiceAnother}
            >
              {t('home.practiceAnother')}
            </button>
          </div>
        ) : null}

        <Suspense
          fallback={
            <p className="mt-10 text-sm text-ink-muted" role="status">
              {t('navigation.loadingPage')}
            </p>
          }
        >
          <PracticeWorkspace store={progressStore} />
        </Suspense>
      </section>
    </>
  )
}
