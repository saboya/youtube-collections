import * as Hooks from 'preact/hooks'

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

const cache = new WeakMap<Function, any>()

export const useInjectScript: <T>(injectedFunction: () => T) => T | undefined = (injectedFunction) => {
  const [state, setState] = Hooks.useState<ReturnType<typeof injectedFunction> | undefined>(undefined)
  const funcString = Hooks.useMemo(() => String(injectedFunction), [injectedFunction])

  const funcId = Hooks.useMemo(() => hashCode(funcString + new Date().toString()), [injectedFunction])

  Hooks.useEffect(() => {
    if (cache.has(injectedFunction)) {
      setState(cache.get(injectedFunction))
      return
    }

    injectString(` ${injectedFuncName}(${funcId}, ${funcString})`)

    const callback: (event: MessageEvent) => void = (e) => {
      if (e.source === window && e.data.type === 'YTC_MSG' && e.data.id === funcId) {
        cache.set(injectedFunction, e.data.data)
        setState(e.data.data)
      }
    }

    window.addEventListener('message', callback)

    return () => window.removeEventListener('message', callback)
  }, [funcId])

  return state
}

export default useInjectScript
