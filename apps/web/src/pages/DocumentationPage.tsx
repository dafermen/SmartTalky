import { Card } from '@smarttalky/ui'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown, { type Components } from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

import {
  documentationCatalog,
  documentationCategories,
  getDocumentationEntry,
  getDocumentationPublicPath,
  resolveDocumentationEntry,
  type DocumentationEntry,
} from '../features/documentation/documentation-catalog'
import { DocumentationShell } from '../features/documentation/DocumentationShell'
import {
  createHeadingId,
  documentationCategoryLabels,
  extractTableOfContents,
  findDocumentation,
  getNodeText,
  type TableOfContentsEntry,
} from '../features/documentation/documentation-navigation'

function getDocumentationAssetPath(
  source: string | undefined,
  documentSourcePath: string,
): string | undefined {
  if (
    source === undefined ||
    /^(?:[a-z]+:|\/|#)/i.test(source) ||
    source.includes('\\')
  ) {
    return source
  }

  const documentDirectory = documentSourcePath.includes('/')
    ? documentSourcePath.slice(0, documentSourcePath.lastIndexOf('/') + 1)
    : ''
  const segments = `${documentDirectory}${source}`.split('/')
  const normalized: string[] = []

  for (const segment of segments) {
    if (segment === '' || segment === '.') continue
    if (segment === '..') {
      normalized.pop()
      continue
    }
    normalized.push(segment)
  }

  return `/documentacion/${normalized.join('/')}`
}

function DocumentCard({ entry }: { entry: DocumentationEntry }) {
  return (
    <li>
      <Link
        className="group block h-full rounded-card border border-border bg-surface-raised p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        to={`/docs/${entry.id}`}
      >
        <span className="font-black text-ink group-hover:text-brand-primary">
          {entry.title}
        </span>
        <span className="mt-2 block text-sm leading-6 text-ink-muted">
          {entry.summary}
        </span>
        <span
          className="mt-4 block text-sm font-bold text-brand-primary"
          aria-hidden="true"
        >
          Leer documento →
        </span>
      </Link>
    </li>
  )
}

function DocumentationIndex({ query }: { query: string }) {
  const { t } = useTranslation()
  const matches = useMemo(() => findDocumentation(query), [query])

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="m-0 text-sm font-black uppercase tracking-wider text-brand-primary">
            {t('documentation.eyebrow')}
          </p>
          <span className="rounded-full bg-stress-surface px-3 py-1 text-xs font-black text-stress-ink">
            {t('documentation.temporaryBadge')}
          </span>
        </div>
        <h1 className="mb-0 mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          {t('documentation.title')}
        </h1>
        <p className="mb-0 mt-5 text-lg leading-8 text-ink-muted">
          {t('documentation.description')}
        </p>
      </header>

      <p className="m-0 text-sm font-bold text-ink-muted" role="status">
        {t('documentation.resultCount', { count: matches.length })}
      </p>

      {matches.length === 0 ? (
        <Card className="p-6 text-center">
          <h2 className="m-0 text-xl font-black">{t('documentation.emptyTitle')}</h2>
          <p className="mb-0 mt-2 text-ink-muted">
            {t('documentation.emptyDescription')}
          </p>
        </Card>
      ) : (
        <div className="grid gap-10">
          {documentationCategories.map((category) => {
            const entries = matches.filter((entry) => entry.category === category)
            if (entries.length === 0) {
              return null
            }

            return (
              <section key={category} aria-labelledby={`category-${category}`}>
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <h2
                    className="m-0 text-2xl font-black tracking-tight"
                    id={`category-${category}`}
                  >
                    {documentationCategoryLabels[category]}
                  </h2>
                  <span className="text-sm font-bold text-ink-muted">
                    {entries.length}
                  </span>
                </div>
                <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                  {entries.map((entry) => (
                    <DocumentCard key={entry.id} entry={entry} />
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TableOfContents({ entries }: { entries: TableOfContentsEntry[] }) {
  const { t } = useTranslation()
  if (entries.length === 0) {
    return null
  }

  return (
    <nav aria-label={t('documentation.tableOfContents')}>
      <p className="m-0 text-sm font-black text-ink">
        {t('documentation.tableOfContents')}
      </p>
      <ol className="mb-0 mt-3 grid list-none gap-2 p-0">
        {entries.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-3' : undefined}>
            <a
              className="block text-sm font-bold leading-5 text-ink-muted hover:text-brand-primary"
              href={`#${heading.id}`}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function DocumentPagination({ entry }: { entry: DocumentationEntry }) {
  const { t } = useTranslation()
  const currentIndex = documentationCatalog.findIndex(({ id }) => id === entry.id)
  const previous = documentationCatalog[currentIndex - 1]
  const next = documentationCatalog[currentIndex + 1]

  return (
    <nav
      className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2"
      aria-label={t('documentation.documentNavigation')}
    >
      {previous ? (
        <Link
          className="rounded-card border border-border bg-surface-muted p-4 transition hover:border-brand-primary hover:bg-brand-soft"
          to={`/docs/${previous.id}`}
        >
          <span className="block text-xs font-black uppercase tracking-wider text-ink-muted">
            ← {t('documentation.previous')}
          </span>
          <span className="mt-1 block font-black text-brand-primary">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          className="rounded-card border border-border bg-surface-muted p-4 text-right transition hover:border-brand-primary hover:bg-brand-soft"
          to={`/docs/${next.id}`}
        >
          <span className="block text-xs font-black uppercase tracking-wider text-ink-muted">
            {t('documentation.next')} →
          </span>
          <span className="mt-1 block font-black text-brand-primary">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  )
}

function DocumentReader({ entry }: { entry: DocumentationEntry }) {
  const { t } = useTranslation()
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const controller = new AbortController()

    fetch(getDocumentationPublicPath(entry), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        return response.text()
      })
      .then((markdown) => {
        setContent(markdown)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setStatus('error')
      })

    return () => controller.abort()
  }, [entry])

  const tableOfContents = useMemo(() => extractTableOfContents(content), [content])
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="mb-6 mt-0 text-3xl font-black tracking-tight sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children, node }) => {
      const id =
        tableOfContents.find(({ line }) => line === node?.position?.start.line)?.id ??
        createHeadingId(getNodeText(children), new Map())
      return (
        <h2
          className="mb-3 mt-10 scroll-mt-44 border-b border-border pb-2 text-2xl font-black"
          id={id}
        >
          {children}
        </h2>
      )
    },
    h3: ({ children, node }) => {
      const id =
        tableOfContents.find(({ line }) => line === node?.position?.start.line)?.id ??
        createHeadingId(getNodeText(children), new Map())
      return (
        <h3 className="mb-2 mt-7 scroll-mt-44 text-xl font-black" id={id}>
          {children}
        </h3>
      )
    },
    p: ({ children }) => <p className="my-4 leading-7 text-ink-muted">{children}</p>,
    ul: ({ children }) => (
      <ul className="my-4 grid list-disc gap-2 pl-6 leading-7 text-ink-muted">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 grid list-decimal gap-2 pl-6 leading-7 text-ink-muted">
        {children}
      </ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-brand-primary bg-brand-soft px-5 py-2">
        {children}
      </blockquote>
    ),
    pre: ({ children }) => (
      <pre className="my-5 overflow-x-auto rounded-card bg-[#172033] p-5 text-sm leading-6 text-white">
        {children}
      </pre>
    ),
    code: ({ children, className }) => (
      <code
        className={
          className ?? 'rounded bg-surface-muted px-1.5 py-0.5 font-mono text-sm text-ink'
        }
      >
        {children}
      </code>
    ),
    img: ({ alt, src }) => (
      <img
        className="my-6 h-auto max-w-full rounded-card border border-border shadow-card"
        src={getDocumentationAssetPath(src, entry.sourcePath)}
        alt={alt ?? ''}
        loading="lazy"
      />
    ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-border bg-surface-muted px-3 py-2 font-black">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-3 py-2 align-top text-ink-muted">
        {children}
      </td>
    ),
    a: ({ children, href }) => {
      const internalEntry = resolveDocumentationEntry(href, entry.sourcePath)
      if (internalEntry) {
        return (
          <Link
            className="font-bold text-brand-primary underline decoration-2 underline-offset-2"
            to={`/docs/${internalEntry.id}`}
          >
            {children}
          </Link>
        )
      }

      const external = Boolean(href && /^https?:/i.test(href))
      const anchor = Boolean(href?.startsWith('#'))
      if (href && !external && !anchor) {
        return (
          <span
            className="font-bold text-ink-muted"
            title={t('documentation.internalFile')}
          >
            {children}
          </span>
        )
      }

      return (
        <a
          className="font-bold text-brand-primary underline decoration-2 underline-offset-2"
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav
        className="mb-5 flex flex-wrap items-center gap-2 text-sm font-bold text-ink-muted"
        aria-label={t('documentation.breadcrumbLabel')}
      >
        <Link className="text-brand-primary hover:underline" to="/docs">
          {t('documentation.overview')}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{entry.title}</span>
      </nav>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_15rem]">
        <Card className="min-w-0 p-5 sm:p-8">
          {status === 'loading' ? (
            <p className="m-0 text-ink-muted" role="status">
              {t('documentation.loading')}
            </p>
          ) : null}
          {status === 'error' ? (
            <div role="alert">
              <h1 className="m-0 text-2xl font-black">{t('documentation.errorTitle')}</h1>
              <p className="mb-0 mt-3 text-ink-muted">
                {t('documentation.errorDescription')}
              </p>
            </div>
          ) : null}
          {status === 'ready' ? (
            <>
              {tableOfContents.length > 0 ? (
                <details className="mb-7 rounded-card border border-border bg-surface-muted p-4 xl:hidden">
                  <summary className="font-black text-ink">
                    {t('documentation.tableOfContents')}
                  </summary>
                  <div className="mt-4">
                    <TableOfContents entries={tableOfContents} />
                  </div>
                </details>
              ) : null}
              <article className="min-w-0 max-w-full break-words overflow-hidden">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                  {content}
                </ReactMarkdown>
              </article>
              <DocumentPagination entry={entry} />
            </>
          ) : null}
        </Card>
        <aside className="hidden rounded-card border border-border bg-surface-muted p-5 xl:sticky xl:top-40 xl:block xl:max-h-[calc(100vh-11rem)] xl:overflow-y-auto">
          <p className="m-0 text-xs font-black uppercase tracking-wider text-brand-primary">
            {documentationCategoryLabels[entry.category]}
          </p>
          <p className="mb-0 mt-2 font-black">{entry.title}</p>
          <p className="mb-0 mt-2 text-sm leading-6 text-ink-muted">{entry.summary}</p>
          {tableOfContents.length > 0 ? (
            <div className="mt-5 border-t border-border pt-5">
              <TableOfContents entries={tableOfContents} />
            </div>
          ) : null}
          <p className="mb-0 mt-5 break-all border-t border-border pt-4 font-mono text-xs text-ink-muted">
            {entry.sourcePath}
          </p>
        </aside>
      </div>
    </div>
  )
}

export function DocumentationPage() {
  const { documentId } = useParams()
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const entry = documentId ? getDocumentationEntry(documentId) : undefined

  if (documentId && !entry) {
    return (
      <DocumentationShell query={query} onQueryChange={setQuery}>
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <h1 className="m-0 text-3xl font-black">
              {t('documentation.notFoundTitle')}
            </h1>
            <p className="mb-6 mt-3 text-ink-muted">
              {t('documentation.notFoundDescription')}
            </p>
            <Link
              className="inline-flex min-h-11 items-center rounded-control bg-brand-primary px-5 font-black text-white hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              to="/docs"
            >
              {t('documentation.back')}
            </Link>
          </Card>
        </div>
      </DocumentationShell>
    )
  }

  return (
    <DocumentationShell currentEntry={entry} query={query} onQueryChange={setQuery}>
      {entry ? (
        <DocumentReader key={entry.id} entry={entry} />
      ) : (
        <DocumentationIndex query={query} />
      )}
    </DocumentationShell>
  )
}
