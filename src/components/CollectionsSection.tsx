import { type FC, type PropsWithChildren, useLayoutEffect, useState } from 'react'
import useYoutubeStatus from '../hooks/useYoutubeStatus'
import { createPortal } from 'react-dom'

const newSectionElement: () => HTMLElement = () => {
  const element = document.createElement('ytd-guide-section-renderer')
  element.setAttribute('class', 'style-scope ytd-guide-renderer')

  return element
}

export const CollectionsSection: FC<PropsWithChildren> = (props) => {
  const [portalElement, setPortalElement] = useState<HTMLElement>()
  const { sectionsElement, subscriptionSectionElement } = useYoutubeStatus()

  useLayoutEffect(() => {
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
