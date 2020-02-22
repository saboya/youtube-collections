/** @jsx h */
import Preact, { h } from 'preact'
import { YtdFormattedString } from '../BasicElements'

export const SectionTitle: Preact.FunctionComponent = (props) => {
  return <h3 className={'style-scope ytd-guide-section-renderer'}>
    <YtdFormattedString id={'guide-section-title'} class={'style-scope ytd-guide-section-renderer'}>
      {props.children}
    </YtdFormattedString>
  </h3>
}
