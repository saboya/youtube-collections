import * as React from 'react'
import {YtImgShadow} from "../BasicElements";

interface Props {
  round: boolean
}

export const SectionItemIcon: React.FunctionComponent<React.PropsWithChildren<Props>> = (props) => {
  return <h3 className='style-scope ytd-guide-section-renderer'>
    <YtImgShadow
        className={'style-scope ytd-guide-entry-renderer no-transition'}
        height={'24'}
        width={'24'}
        disable-upgrade={''}
        style={{ borderRadius: props.round ? '50' : '0' }}
        hidden
    >
      {props.children}
    </YtImgShadow>
  </h3>
}
