/** jsx h */
import Peact, { h } from 'preact'

export const SectionItems: Peact.FunctionComponent = (props) => {
  return <div id={'items'} className={'style-scope ytd-guide-section-renderer'}>
    {props.children}
  </div>
}
