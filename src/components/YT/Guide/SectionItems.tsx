import * as React from 'react'

export const SectionItems: React.FunctionComponent<React.PropsWithChildren> = (props) => {
  return <div id={'items'} className={'style-scope ytd-guide-section-renderer'}>
    {props.children}
  </div>
}
