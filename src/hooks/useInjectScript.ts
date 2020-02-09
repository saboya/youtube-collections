import * as React from 'react'

const hashCode: (code: string) => number = (code) => {
  let hash = 0
  const iFinish = code.length

  for (let i = 0; i <= iFinish; ++i) {
    const chr = code.charCodeAt(i) | 0
    hash = ((hash << 5) - hash | 0) - chr | 0
  }

  return hash
}

const injectedFuncName = chrome.runtime.id

const injectString: (scriptString: string) => void = (scriptString) => {
  const script = document.createElement('script')
  script.textContent = scriptString

  document.documentElement.appendChild(script)
}

const script = `;(() => window['${injectedFuncName}'] = (id, data) => {
  window.postMessage({
    type: 'YTC_MSG',
    id: id,
    data: data()
  }, '*')
})();`

injectString(script)

export const useInjectScript: <T>(injectedFunction: () => T) => [T | undefined] = (injectedFunction) => {
  const [state, setState] = React.useState<ReturnType<typeof injectedFunction> | undefined>()
  const memoizedFunction = React.useMemo(() => injectedFunction, [String(injectedFunction)])

  const funcString = String(injectedFunction)
  const funcId = React.useMemo(() => hashCode(funcString + new Date().toString()), [])

  React.useEffect(() => {
    injectString(` ${injectedFuncName}(${funcId}, ${String(funcString)})`)

    const callback: (event: MessageEvent) => void = (e) => {
      if (e.source === window && e.data.type === 'YTC_MSG' && e.data.id === funcId) {
        setState(e.data.data)
      } else {
      }
    }

    window.addEventListener('message', callback)

    return () => window.removeEventListener('message', callback)
  }, [memoizedFunction])

  return [state]
}

export default useInjectScript
