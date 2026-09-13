import { Card } from '@smarttalky/ui'
import { useTranslation } from 'react-i18next'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header>
        <p className="m-0 text-sm font-black uppercase tracking-wider text-brand-primary">
          {t('about.eyebrow')}
        </p>
        <h1 className="mb-0 mt-3 text-4xl font-black tracking-tight">
          {t('about.title')}
        </h1>
        <p className="mb-0 mt-5 text-lg leading-8 text-ink-muted">
          {t('about.description')}
        </p>
      </header>
      <Card className="grid gap-3 p-6 sm:p-8">
        <h2 className="m-0 text-2xl font-black">{t('about.privacyTitle')}</h2>
        <p className="m-0 leading-7 text-ink-muted">{t('about.privacyDescription')}</p>
        <p className="m-0 leading-7 text-ink-muted">{t('about.dataControls')}</p>
      </Card>
      <Card className="grid gap-5 p-6 sm:p-8">
        <div>
          <h2 className="m-0 text-2xl font-black">{t('about.voicesTitle')}</h2>
          <p className="mb-0 mt-3 leading-7 text-ink-muted">
            {t('about.voicesDescription')}
          </p>
        </div>
        <dl className="m-0 grid gap-3 sm:grid-cols-2">
          <div className="rounded-card bg-indigo-50 p-4">
            <dt className="font-black text-indigo-950">{t('about.primaryVoice')}</dt>
            <dd className="mb-0 mt-2 leading-6 text-indigo-950">
              {t('about.primaryVoiceDescription')}
            </dd>
          </div>
          <div className="rounded-card bg-teal-50 p-4">
            <dt className="font-black text-teal-950">{t('about.browserVoice')}</dt>
            <dd className="mb-0 mt-2 leading-6 text-teal-950">
              {t('about.browserVoiceDescription')}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
