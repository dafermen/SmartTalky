import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { isDocumentationEnabled } from '../features/documentation/documentation-config'

/** Layout mobile-first con salto al contenido y navegación breve. */
export function AppLayout() {
  const { t } = useTranslation()
  const documentationEnabled = isDocumentationEnabled()

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap rounded-control px-2 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:px-3 sm:text-sm ${
      isActive
        ? 'bg-brand-soft text-brand-primary'
        : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
    }`

  return (
    <div className="min-h-screen bg-surface text-ink">
      <a className="skip-link" href="#main-content">
        {t('navigation.skipToContent')}
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-surface-raised/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch gap-1 px-4 py-2 sm:min-h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-0 lg:px-8">
          <NavLink
            to="/"
            className="flex items-center gap-1.5 rounded-control font-black tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:gap-2"
            aria-label={t('brand.homeLabel')}
          >
            <img
              className="size-9 rounded-xl shadow-sm"
              src="/favicon.svg"
              alt=""
              width="36"
              height="36"
            />
            <span>{t('brand.name')}</span>
          </NavLink>
          <nav className="w-full sm:w-auto" aria-label={t('navigation.mainLabel')}>
            <ul
              className={`m-0 grid w-full list-none items-center gap-0 p-0 sm:flex sm:w-auto sm:gap-1 ${
                documentationEnabled ? 'grid-cols-3' : 'grid-cols-2'
              }`}
            >
              <li>
                <NavLink to="/" end className={navClassName}>
                  {t('navigation.practice')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/acerca" className={navClassName}>
                  {t('navigation.about')}
                </NavLink>
              </li>
              {documentationEnabled ? (
                <li>
                  <NavLink to="/docs" className={navClassName}>
                    {t('navigation.documentation')}
                  </NavLink>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface-raised">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-ink-muted sm:px-6 lg:px-8">
          <strong className="text-ink">{t('brand.name')}</strong>
          <span>{t('footer.message')}</span>
        </div>
      </footer>
    </div>
  )
}
