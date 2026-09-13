import { createHash } from 'node:crypto'

interface EducationalContentIdentity {
  text: string
  locale: 'en-US'
  model: string
  promptVersion: string
}

/** La identidad nunca deja el texto del usuario visible en nombres de archivo. */
export function createEducationalContentKey(
  identity: EducationalContentIdentity,
): string {
  const canonical = JSON.stringify({
    version: 'educational-content-identity-v1',
    text: identity.text,
    locale: identity.locale,
    model: identity.model,
    promptVersion: identity.promptVersion,
  })

  return createHash('sha256').update(canonical, 'utf8').digest('hex')
}
