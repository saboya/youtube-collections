import * as React from 'react'

export interface Props {
  checked: boolean
}

export const Item: React.FunctionComponent<Props> = (props) => (
  <div id='guide-section-title' className='style-scope ytd-guide-section-renderer'>
    {props.children}
  </div>
)
