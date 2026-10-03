import { useRef, useState, type ReactNode } from 'react'
import { getNodeText } from './documentation-navigation'

export function CopyableCode({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('Copiar código')
  async function copy() {
    try {
      await navigator.clipboard.writeText(getNodeText(children))
      setMessage('Copiado')
    } catch {
      setMessage('Selecciona el código para copiar')
    }
  }
  return (
    <div className="docs-code">
      <button className="docs-copy" onClick={() => void copy()} type="button">
        {message}
      </button>
      <pre className="my-3 overflow-x-auto rounded-card bg-[#172033] p-5 text-sm leading-6 text-white">
        {children}
      </pre>
      <span className="sr-only" role="status">
        {message === 'Copiar código' ? '' : message}
      </span>
    </div>
  )
}

export function ExpandableImage({ src, alt }: { src: string | undefined; alt: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  if (!src) return null
  return (
    <>
      <button
        type="button"
        className="docs-image-button"
        aria-label={`Ampliar imagen: ${alt || 'Ilustración'}`}
        onClick={() => dialog.current?.showModal()}
      >
        <img
          className="my-6 h-auto max-w-full rounded-card border border-border shadow-card"
          src={src}
          alt={alt}
          loading="lazy"
        />
      </button>
      <dialog
        ref={dialog}
        className="docs-image-dialog"
        aria-label={alt || 'Imagen ampliada'}
      >
        <form method="dialog">
          <button className="docs-copy" autoFocus>
            Cerrar imagen
          </button>
        </form>
        <img src={src} alt={alt} />
      </dialog>
    </>
  )
}
