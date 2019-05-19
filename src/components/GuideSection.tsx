import * as React from 'react'
import { createPortal } from 'react-dom'
import { useYoutubeStatus } from '../hooks/useYoutubeStatus'

interface Props {}

export const GuideSection: React.FunctionComponent<Props> = (props) => {
  const { sectionsElement } = useYoutubeStatus()

  return sectionsElement !== undefined
    ? createPortal(props.children, sectionsElement)
    : null
}
