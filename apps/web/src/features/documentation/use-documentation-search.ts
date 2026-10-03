import { useEffect, useMemo, useState } from 'react'
import { documentationCatalog } from './documentation-catalog'
import { normalizeDocumentationSearch } from './documentation-navigation'

export interface SearchSource {
  sourcePath: string
  content: string
}
export function matchDocumentation(query: string, sources: SearchSource[]) {
  const terms = normalizeDocumentationSearch(query.trim()).split(/\s+/).filter(Boolean)
  return documentationCatalog.filter((entry) => {
    const body =
      sources.find((source) => source.sourcePath === entry.sourcePath)?.content ?? ''
    const text = normalizeDocumentationSearch(
      [entry.title, entry.summary, ...entry.keywords, body].join(' '),
    )
    return terms.every((term) => text.includes(term))
  })
}
export function useDocumentationSearch(query: string) {
  const [sources, setSources] = useState<SearchSource[]>([])
  useEffect(() => {
    const controller = new AbortController()
    fetch('/documentacion/search-index.json', { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<unknown>) : []))
      .then((value: unknown) => {
        if (Array.isArray(value))
          setSources(
            value.filter(
              (item): item is SearchSource =>
                typeof item === 'object' &&
                item !== null &&
                typeof item.sourcePath === 'string' &&
                typeof item.content === 'string',
            ),
          )
      })
      .catch(() => {
        /* El catálogo conserva búsqueda aun sin índice descargado. */
      })
    return () => controller.abort()
  }, [])
  return useMemo(() => matchDocumentation(query, sources), [query, sources])
}
