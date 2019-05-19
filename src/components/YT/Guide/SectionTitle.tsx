import * as React from 'react'

export const SectionTitle: React.FunctionComponent = (props) => (
  <h3 className='style-scope ytd-guide-section-renderer'>
    {React.createElement(
      'yt-formatted-string',
      {
        id: 'guide-section-title',
        className: 'style-scope ytd-guide-section-renderer',
      },
      props.children,
    )}
  </h3>
)
