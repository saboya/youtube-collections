import * as Hooks from 'preact/hooks'

const isDarkTheme = (): boolean => document.documentElement.getAttribute('dark') !== null

export const useIsDarkTheme: () => boolean = () => {
  const [state, setState] = Hooks.useState<boolean>(isDarkTheme())

  Hooks.useEffect(() => {
    const observer = new MutationObserver(() => {
      setState(() => isDarkTheme())
    })

    observer.observe(document.documentElement, { attributes: true })
  }, [])

  return state
}
