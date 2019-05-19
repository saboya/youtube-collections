import * as React from 'react'

interface Props {
  round: boolean
}

export const SectionItemIcon: React.FunctionComponent<Props> = (props) => {
  return <h3 className='style-scope ytd-guide-section-renderer'>
    {React.createElement(
      'yt-img-shadow',
      {
        height: 24,
        width: 24,
        className: 'style-scope ytd-guide-entry-renderer no-transition',
        'disable-upgrade': '',
        style: { borderRadius: props.round ? '50' : '0' },
      },
      props.children,
    )}
  </h3>
}
