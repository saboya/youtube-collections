import * as React from 'react'
import { createPortal } from 'react-dom'
import { useYoutubeStatus } from '../../../hooks/useYoutubeStatus'

export const GuideSection: React.FunctionComponent = (props) => {
  const [element] = React.useState(() => {
    const element = document.createElement('ytd-guide-section-renderer')
    element.setAttribute('class', 'style-scope ytd-guide-renderer')

    return element
  })

  const { isGuideRendererReady } = useYoutubeStatus()

  React.useEffect(() => {
    if (isGuideRendererReady) {

    }
  }, [isGuideRendererReady])

  if (!isGuideRendererReady) {
    return null
  }

  return createPortal(
    props.children,
    element,
  )
}
