import * as React from 'react'

export interface Props {
  left: string
  top: string
  isOpen: boolean
}

export const DropDown: React.FunctionComponent<Props> = (props) => (
  <div id='guide-section-title' className='style-scope ytd-guide-section-renderer'>
    {props.children}
  </div>
)
