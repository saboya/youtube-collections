import React from 'react'

type HTMLProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const clearFirst = <T extends HTMLProps>(WrappedComponent: React.ComponentType<T>) => {
  return (props: T) => {
    const elementRef = React.useRef<HTMLElement>(null)
    const [refCleared, setRefCleared] = React.useState(false)

    React.useLayoutEffect(() => {
      if (elementRef.current !== null) {
        elementRef.current.innerHTML = ''
        setRefCleared(true)
      }
    }, [])

    const { children, ...propsWithoutChildren } = props

    const childrenToRender = React.useMemo(() => refCleared ? children : null, [children, refCleared])

    return React.createElement(
      WrappedComponent,
      {
        ...propsWithoutChildren as T,
        ref: elementRef,
      },
      childrenToRender,
    )
  }
}
