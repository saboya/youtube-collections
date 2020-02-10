import * as React from 'react'
import { PaperItem, YtdGuideEntryRenderer, YtFormattedString, YtIcon, YtImgShadow } from '../BasicElements'

interface Props {
  label?: string
  image: string
  counter: number
  uri: string
}

export const SectionItem: React.FunctionComponent<Props> = (props) => {
  return (
    <YtdGuideEntryRenderer class={'style-scope ytd-guide-section-renderer'} line-end-style={'badge'}>
      <a id={'endpoint'} className={'yt-simple-endpoint style-scope ytd-guide-entry-renderer'} tabIndex={-1} role={'tablist'}>
        <PaperItem role={'tab'} class={'style-scope ytd-guide-entry-renderer'} tabindex={'0'} aria-disabled={'false'}>
          <YtIcon class={'guide-icon style-scope ytd-guide-entry-renderer'} disable-upgrade={''}></YtIcon>
          <YtImgShadow height={'24'} width={'24'} class="style-scope ytd-guide-entry-renderer" disable-upgrade={''}>
          </YtImgShadow>
          <YtFormattedString class="title style-scope ytd-guide-entry-renderer">{props.label}</YtFormattedString>
          <span className={'guide-entry-count style-scope ytd-guide-entry-renderer'}></span>
          <YtIcon class={'guide-entry-badge style-scope ytd-guide-entry-renderer'} disable-upgrade={''}></YtIcon>
          <div id={'newness-dot'} className={'style-scope ytd-guide-entry-renderer'}></div>
        </PaperItem>
      </a>
    </YtdGuideEntryRenderer>
  )
}
