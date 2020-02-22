import Preact, { h } from 'preact'
import Hooks from 'preact/hooks'

interface Props {
  round: boolean
}

export const SectionItemIcon: Preact.FunctionComponent<Props> = (props) => {
  const ref = Hooks.useRef<SVGElement>()

  Hooks.useEffect(() => {
    if (ref.current !== undefined) {
      ref.current.innerHTML = ''
    }
  }, [ref.current])

  return <h3 className='style-scope ytd-guide-section-renderer'>
    {Preact.createElement(
      'yt-img-shadow',
      {
        height: 24,
        width: 24,
        className: 'style-scope ytd-guide-entry-renderer no-transition',
        hidden: false,
        'disable-upgrade': '',
        style: { borderRadius: props.round ? '50' : '0' },
        ref,
      },
      props.children,
    )}
  </h3>
}
