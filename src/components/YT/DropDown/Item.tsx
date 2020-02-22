/** @jsx h */
import Preact, { h } from 'preact'

export interface Props {
  checked: boolean
}

export const Item: Preact.FunctionComponent<Props> = (props) => (
  <div id='guide-section-title' className='style-scope ytd-guide-section-renderer'>
    {props.children}
  </div>
)
