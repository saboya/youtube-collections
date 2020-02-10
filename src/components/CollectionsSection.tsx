import * as React from 'react'
import useYoutubeStatus from '../hooks/useYoutubeStatus'
import { createPortal } from 'react-dom'

const newSectionElement: () => HTMLElement = () => {
  const element = document.createElement('ytd-guide-section-renderer')
  element.setAttribute('class', 'style-scope ytd-guide-renderer')

  return element
}

export const CollectionsSection: React.FunctionComponent = (props) => {
  const [portalElement, setPortalElement] = React.useState<HTMLElement>()
  const { sectionsElement, subscriptionSectionElement } = useYoutubeStatus()

  React.useLayoutEffect(() => {
    if (sectionsElement !== undefined && subscriptionSectionElement !== undefined) {
      const collectionsSectionElement = newSectionElement()

      sectionsElement.insertBefore(collectionsSectionElement, subscriptionSectionElement)
      collectionsSectionElement.innerHTML = ''

      setPortalElement(collectionsSectionElement)
    }
  }, [sectionsElement, subscriptionSectionElement])

  return portalElement !== undefined
    ? createPortal(props.children, portalElement)
    : null
}
