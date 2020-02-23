import * as Preact from 'preact'
import * as Hooks from 'preact/hooks'
import { JSXInternal } from 'preact/src/jsx'

export const clearFirst = <T extends JSXInternal.HTMLAttributes<SVGElement>>(WrappedComponent: Preact.ComponentType<T>) => {
  return (props: T) => {
    const elementRef = Hooks.useRef<HTMLElement>(null)
    const [refCleared, setRefCleared] = Hooks.useState(false)

    Hooks.useLayoutEffect(() => {
      if (elementRef.current !== null) {
        elementRef.current.innerHTML = ''
        setRefCleared(true)
      }
    }, [])

    const { children, ...propsWithoutChildren } = props

    const childrenToRender = Hooks.useMemo(() => refCleared ? children : null, [children, refCleared])

    return Preact.createElement(
      WrappedComponent,
      {
        ...propsWithoutChildren as T,
        ref: elementRef,
      },
      childrenToRender,
    )
  }
}
