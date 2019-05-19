import * as React from 'react'

import { SectionItemIcon } from './'

interface Props {
  label?: string
  image: string,
  counter: number,
  uri: string
}

export const SectionItem: React.FunctionComponent<Props> = (props) => (
  React.createElement(
    'ytd-guide-entry-renderer',
    {
      role: 'option',
      tabIndex: 0,
      'aria-disabled': false,
      className: 'style-scope ytd-guide-section-renderer',
      'disable-upgrade': 'a',
    },
    <a
      id='enpoint'
      className='yt-simple-endpoint style-scope ytd-guide-entry-renderer'
      href={props.uri}
    >
      <SectionItemIcon round={true}>
        <img id='img' className='style-scope yt-img-shadow' src={props.image} />
      </SectionItemIcon>,
      <span
        className='title style-scope ytd-guide-entry-renderer'
      >
        {props.label}
      </span>,
      <span className='guide-entry-count style-scope ytd-guide-entry-renderer'>
        {props.counter > 0 ? props.counter : ''}
      </span>
    </a>,
  )
)
