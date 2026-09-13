import { isValidElement, type ReactNode } from 'react'

import { documentationCatalog } from './documentation-catalog'

export const documentationCategoryLabels = {
  inicio: 'Primeros pasos',
  producto: 'Producto y requisitos',
  ingenieria: 'Ingeniería',
  calidad: 'Calidad y entrega',
  gestion: 'Gestión del proyecto',
  decisiones: 'Decisiones técnicas',
} as const

export interface TableOfContentsEntry {
  id: string
  level: 2 | 3
  line: number
  title: string
}

export function normalizeDocumentationSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es')
}

export function findDocumentation(query: string) {
  const normalizedQuery = normalizeDocumentationSearch(query.trim())
  if (!normalizedQuery) {
    return documentationCatalog
  }

  return documentationCatalog.filter((entry) =>
    normalizeDocumentationSearch(
      [entry.title, entry.summary, ...entry.keywords].join(' '),
    ).includes(normalizedQuery),
  )
}

export function createHeadingId(title: string, occurrences: Map<string, number>) {
  const base =
    normalizeDocumentationSearch(title)
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') || 'seccion'
  const count = occurrences.get(base) ?? 0
  occurrences.set(base, count + 1)
  return count === 0 ? base : `${base}-${count + 1}`
}

function cleanMarkdownHeading(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()
}

export function extractTableOfContents(markdown: string): TableOfContentsEntry[] {
  const occurrences = new Map<string, number>()
  return [...markdown.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm)].map((match) => {
    const marker = match[1] ?? '##'
    const title = cleanMarkdownHeading(match[2] ?? '')
    return {
      id: createHeadingId(title, occurrences),
      level: marker.length as 2 | 3,
      line: markdown.slice(0, match.index).split('\n').length,
      title,
    }
  })
}

export function getNodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join('')
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children)
  }
  return ''
}
