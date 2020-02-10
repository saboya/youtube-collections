import * as React from 'react'

type CustomElement = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> | {
  class?: string
  tabindex?: string
}

type YtImgShadow = CustomElement | { height?: string, width?: string }

type YtdGuideEntryRenderer = CustomElement | { 'line-end-style': string }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'paper-item': CustomElement
      'yt-formatted-string': CustomElement
      'yt-icon': CustomElement
      'yt-img-shadow': YtImgShadow
      'ytd-formatted-string': CustomElement
      'ytd-guide-entry-renderer': YtdGuideEntryRenderer
      'ytd-guide-section-renderer': CustomElement
    }
  }
}
