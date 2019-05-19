import * as React from 'react'
import { useYoutubeStatus } from '../hooks/useYoutubeStatus'

interface Props {
  render: () => React.ReactElement
}

export const GuideLoaded: React.FunctionComponent<Props> = (props) => {
  const { isGuideRendererReady } = useYoutubeStatus()

  return <>{isGuideRendererReady ? props.render() : null}</>
}
