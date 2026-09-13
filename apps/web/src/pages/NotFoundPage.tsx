import { Button, Card } from '@smarttalky/ui'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="grid justify-items-start gap-4 p-7 sm:p-10">
        <span className="text-sm font-black text-brand-primary">
          {t('notFound.code')}
        </span>
        <h1 className="m-0 text-3xl font-black">{t('notFound.title')}</h1>
        <p className="m-0 leading-7 text-ink-muted">{t('notFound.description')}</p>
        <Button onClick={() => void navigate('/')}>{t('notFound.action')}</Button>
      </Card>
    </div>
  )
}
