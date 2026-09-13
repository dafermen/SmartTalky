/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOW_DOCUMENTATION?: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
