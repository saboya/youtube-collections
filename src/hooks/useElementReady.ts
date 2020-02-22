import * as Hooks from 'preact/hooks'

interface Props {
  mutationCallback: () => Element | undefined
  targetNode: Node | null
}

export const useElementReady: (props: Props) => [Element | undefined] = (props) => {
  const [element, setElement] = Hooks.useState<Element | undefined>(props.mutationCallback())

  const handler = Hooks.useCallback<MutationCallback>((_, observer) => {
    const callbackReturn = props.mutationCallback()
    if (callbackReturn === undefined) {
      return
    }

    observer.disconnect()
    observer.takeRecords()

    setElement(callbackReturn)
  }, [props.mutationCallback])

  Hooks.useEffect(() => {
    if (props.targetNode === null || element !== undefined) {
      return
    }

    const observer = new MutationObserver(handler)

    observer.observe(props.targetNode, { childList: true })

    return () => {
      observer.disconnect()
    }
  }, [handler, props.targetNode])

  return [element]
}

export default useElementReady
