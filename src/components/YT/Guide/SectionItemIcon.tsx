import * as React from 'react'

interface Props {
  round: boolean
}

export const SectionItemIcon: React.FunctionComponent<Props> = (props) => {
  const ref = React.useRef<Element>()

  React.useEffect(() => {
    if (ref.current !== undefined) {
      ref.current.innerHTML = ''
    }
  }, [ref.current])

  return <h3 className='style-scope ytd-guide-section-renderer'>
    {React.createElement(
      'yt-img-shadow',
      {
        height: 24,
        width: 24,
        className: 'style-scope ytd-guide-entry-renderer no-transition',
        hidden: '',
        'disable-upgrade': '',
        style: { borderRadius: props.round ? '50' : '0' },
        ref,
      },
      props.children,
    )}
  </h3>
}
