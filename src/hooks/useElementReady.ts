import * as Hooks from 'preact/hooks'

interface Props {
  mutationCallback: () => Element | undefined
  targetNode: Node | null
}

export const useElementReady: (props: Props) => Element | undefined = (props) => {
  const [element, setElement] = Hooks.useState<Element | undefined>(undefined)

  const handler = Hooks.useCallback<MutationCallback>((_, observer) => {
    const callbackReturn = props.mutationCallback()
    if (callbackReturn === undefined) {
      return
    }

    observer.disconnect()
    observer.takeRecords()

    setElement(callbackReturn)
  }, [props.mutationCallback])

  Hooks.useLayoutEffect(() => {
    if (props.targetNode === null) {
      return
    }

    if (props.mutationCallback() !== undefined) {
      setElement(props.mutationCallback())
      return
    }

    const observer = new MutationObserver(handler)

    observer.observe(props.targetNode, { childList: true })

    return () => {
      observer.disconnect()
      observer.takeRecords()
    }
  }, [handler, props.targetNode])

  return element
}

export default useElementReady
