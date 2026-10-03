import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './documentation-brand.css'
import { Link } from 'react-router-dom'

import {
  documentationCatalog,
  documentationCategories,
  type DocumentationEntry,
} from './documentation-catalog'
import { documentationCategoryLabels } from './documentation-navigation'

import { useDocumentationSearch } from './use-documentation-search'

type DocumentationTheme = 'light' | 'dark'

function getInitialTheme(): DocumentationTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  try {
    const stored = window.localStorage.getItem('smarttalky-documentation-theme')
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
  } catch {
    // El tema sigue disponible aunque el navegador bloquee almacenamiento.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function useDocumentationTheme() {
  const [theme, setTheme] = useState<DocumentationTheme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.documentationTheme = theme
    document.documentElement.dataset.docsBrand = 'innovalogic'
    try {
      window.localStorage.setItem('smarttalky-documentation-theme', theme)
    } catch {
      // La preferencia dura la sesión cuando localStorage no está disponible.
    }

    return () => {
      delete document.documentElement.dataset.documentationTheme
      delete document.documentElement.dataset.docsBrand
    }
  }, [theme])

  return {
    theme,
    toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
  }
}

function DocumentationSidebar({
  currentEntry,
  idPrefix,
  onNavigate,
}: {
  currentEntry?: DocumentationEntry | undefined
  idPrefix: 'desktop' | 'mobile'
  onNavigate?: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-5">
      <a
        className="inline-flex min-h-11 items-center rounded-control border border-border bg-surface-raised px-4 font-black text-brand-primary shadow-sm transition hover:border-brand-primary hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        href="/"
        target="_self"
        onClick={onNavigate}
      >
        ← {t('documentation.backToApplication')}
      </a>
      <nav aria-label={t('documentation.navigationLabel')}>
        <Link
          className={`mb-4 block rounded-control px-3 py-2 font-black transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
            currentEntry
              ? 'text-ink-muted hover:bg-surface-muted hover:text-ink'
              : 'bg-brand-soft text-brand-primary'
          }`}
          to="/docs"
          onClick={onNavigate}
          aria-current={currentEntry ? undefined : 'page'}
        >
          {t('documentation.overview')}
        </Link>
        <div className="grid gap-6">
          {documentationCategories.map((category) => (
            <details
              key={category}
              open
              className="docs-category"
              aria-labelledby={`docs-nav-${idPrefix}-${category}`}
            >
              <summary
                className="m-0 px-3 text-xs font-black uppercase tracking-wider text-ink-muted"
                id={`docs-nav-${idPrefix}-${category}`}
              >
                {documentationCategoryLabels[category]}
              </summary>
              <ul className="mb-0 mt-2 grid list-none gap-0.5 p-0">
                {documentationCatalog
                  .filter((entry) => entry.category === category)
                  .map((entry) => {
                    const current = currentEntry?.id === entry.id
                    return (
                      <li key={entry.id}>
                        <Link
                          className={`block rounded-control px-3 py-2 text-sm font-bold leading-5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                            current
                              ? 'bg-brand-soft text-brand-primary'
                              : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
                          }`}
                          to={`/docs/${entry.id}`}
                          onClick={onNavigate}
                          aria-current={current ? 'page' : undefined}
                        >
                          {entry.title}
                        </Link>
                      </li>
                    )
                  })}
              </ul>
            </details>
          ))}
        </div>
      </nav>
    </div>
  )
}

export function DocumentationShell({
  children,
  currentEntry,
  query,
  onQueryChange,
}: {
  children: ReactNode
  currentEntry?: DocumentationEntry | undefined
  query: string
  onQueryChange: (value: string) => void
}) {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!mobileMenuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
        mobileMenuButton.current?.focus()
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [mobileMenuOpen])
  const { theme, toggleTheme } = useDocumentationTheme()
  const searchResults = useDocumentationSearch(query)

  return (
    <div className="docs-brand min-h-screen bg-surface text-ink">
      <header className="docs-header sticky top-0 z-30 border-b border-border bg-surface-raised/95 shadow-sm backdrop-blur-xl ">
        <div className="docs-toolbar mx-auto grid w-full max-w-[90rem] gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[auto_minmax(14rem,26rem)_auto] lg:items-center lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <button
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-control border border-border bg-surface-raised font-black text-ink lg:hidden"
              type="button"
              ref={mobileMenuButton}
              aria-controls="documentation-mobile-navigation"
              aria-expanded={mobileMenuOpen}
              aria-label={
                mobileMenuOpen
                  ? t('documentation.closeMenu')
                  : t('documentation.openMenu')
              }
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? '×' : '☰'}
            </button>
            <Link
              className="truncate rounded-control font-black tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              to="/docs"
            >
              SmartTalky <span className="text-brand-primary">Docs</span>
            </Link>
            <a
              href="/"
              className="ml-auto rounded-control px-2 py-2 text-xs font-bold text-brand-primary lg:hidden"
              aria-label="Volver a la aplicación"
            >
              ← App
            </a>
            <nav
              className="ml-3 hidden items-center gap-1 xl:flex"
              aria-label={t('documentation.sectionLinksLabel')}
            >
              <Link
                className="rounded-control px-3 py-2 text-sm font-bold text-ink-muted hover:bg-surface-muted hover:text-ink"
                to="/docs"
              >
                Docs
              </Link>
              <Link
                className="rounded-control px-3 py-2 text-sm font-bold text-ink-muted hover:bg-surface-muted hover:text-ink"
                to="/docs/vision"
              >
                Producto
              </Link>
              <Link
                className="rounded-control px-3 py-2 text-sm font-bold text-ink-muted hover:bg-surface-muted hover:text-ink"
                to="/docs/arquitectura"
              >
                Arquitectura
              </Link>
              <Link
                className="rounded-control px-3 py-2 text-sm font-bold text-ink-muted hover:bg-surface-muted hover:text-ink"
                to="/docs/estado-actual"
              >
                Estado
              </Link>
            </nav>
          </div>
          <div>
            <label className="sr-only" htmlFor="documentation-search">
              {t('documentation.searchLabel')}
            </label>
            <input
              id="documentation-search"
              className="min-h-11 w-full rounded-control border border-border bg-surface-raised px-4 text-ink shadow-sm outline-none placeholder:text-ink-muted focus:border-focus focus:shadow-control"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={t('documentation.searchPlaceholder')}
            />
          </div>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-border bg-surface-raised px-4 font-black text-ink shadow-sm transition hover:border-brand-primary hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:justify-self-end"
            type="button"
            aria-pressed={theme === 'dark'}
            onClick={toggleTheme}
          >
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            {theme === 'light'
              ? t('documentation.darkTheme')
              : t('documentation.lightTheme')}
          </button>
        </div>
      </header>

      {mobileMenuOpen ? (
        <aside
          className="border-b border-border bg-surface-raised px-4 py-5 sm:px-6 lg:hidden"
          id="documentation-mobile-navigation"
        >
          <DocumentationSidebar
            currentEntry={currentEntry}
            idPrefix="mobile"
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </aside>
      ) : null}

      {currentEntry && query.trim() ? (
        <section
          className="border-b border-border bg-surface-muted px-4 py-4 sm:px-6 lg:px-8"
          aria-label={t('documentation.searchResultsLabel')}
        >
          <div className="mx-auto w-full max-w-[90rem]">
            <p className="m-0 text-sm font-black text-ink-muted">
              {t('documentation.resultCount', { count: searchResults.length })}
            </p>
            {searchResults.length > 0 ? (
              <ul className="mb-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                {searchResults.slice(0, 8).map((entry) => (
                  <li key={entry.id}>
                    <Link
                      className="inline-flex rounded-full border border-border bg-surface-raised px-3 py-2 text-sm font-bold text-brand-primary hover:border-brand-primary"
                      to={`/docs/${entry.id}`}
                      onClick={() => onQueryChange('')}
                    >
                      {entry.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-0 mt-2 text-sm text-ink-muted">
                {t('documentation.emptyDescription')}
              </p>
            )}
          </div>
        </section>
      ) : null}

      <div className="mx-auto grid w-full max-w-[90rem] items-start lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-border px-5 py-8 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <DocumentationSidebar currentEntry={currentEntry} idPrefix="desktop" />
        </aside>
        <main id="documentation-content" tabIndex={-1} className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
