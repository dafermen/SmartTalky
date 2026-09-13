type NavigateBack = () => void
type ExitApp = () => Promise<void>

/** Decide si el botón físico vuelve dentro de la aplicación o la cierra desde el inicio. */
export function handleNativeBack(
  pathname: string,
  navigateBack: NavigateBack,
  exitApp: ExitApp,
) {
  if (pathname !== '/') {
    navigateBack()
    return
  }

  void exitApp()
}
