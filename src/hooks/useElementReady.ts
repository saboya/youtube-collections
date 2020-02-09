import * as React from 'react'

interface Props {
  mutationCallback: () => Element | undefined
  targetNode: Node | null
}

export type useElementReadyReturn = [Element | undefined] & {
  element: Element | undefined
}

export const useElementReady: (props: Props) => useElementReadyReturn = (props) => {
  const [element, setElement] = React.useState<Element | undefined>(props.mutationCallback())

  const handler = React.useCallback<MutationCallback>((_, observer) => {
    const callbackReturn = props.mutationCallback()
    if (callbackReturn !== undefined) {
      observer.disconnect()
      observer.takeRecords()

      setElement(callbackReturn)
    }
  }, [props.mutationCallback])

  React.useEffect(() => {
    if (props.targetNode !== null && element === undefined) {
      const observer = new MutationObserver(handler)

      observer.observe(props.targetNode, { childList: true })
    }
  }, [props.targetNode])

  const temp = [element] as any
  temp.element = element

  return temp
}

export default useElementReady
