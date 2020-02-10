import * as React from 'react'
import { YtdFormattedString } from '../BasicElements'

// // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
// const newYTFormattedString: () => HTMLElement = () => {
//   const element = document.createElement('yt-formatted-string')
//   element.setAttribute('id', 'guide-section-title')
//   element.setAttribute('class', 'style-scope ytd-guide-section-renderer')
//
//   return element
// }

export const SectionTitle: React.FunctionComponent = (props) => {
  return <h3 className={'style-scope ytd-guide-section-renderer'}>
    <YtdFormattedString id={'guide-section-title'} class={'style-scope ytd-guide-section-renderer'}>
      {props.children}
    </YtdFormattedString>
  </h3>
}
