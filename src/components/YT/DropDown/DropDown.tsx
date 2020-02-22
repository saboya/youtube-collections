/** @jsx h */
import Preact, { h } from 'preact'

export interface Props {
  left: string
  top: string
  isOpen: boolean
}

export const DropDown: Preact.FunctionComponent<Props> = (props) => (
  <div id='guide-section-title' className='style-scope ytd-guide-section-renderer'>
    {props.children}
  </div>
)
