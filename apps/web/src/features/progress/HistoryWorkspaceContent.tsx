import type { LocalProgressStore } from './local-progress-store'
import { HistoryPanel } from './HistoryPanel'

export function HistoryWorkspaceContent({ store }: { store: LocalProgressStore }) {
  return (
    <div className="border-t border-border bg-surface p-3 sm:p-4">
      <HistoryPanel store={store} />
    </div>
  )
}
