/** @jsx h */
import Preact, { h, Fragment } from 'preact'
import * as Hooks from 'preact/hooks'
import { createPortal } from 'preact/compat'
import useYoutubeStatus from '../hooks/useYoutubeStatus'

const newSectionElement: () => HTMLElement = () => {
  const element = document.createElement('ytd-guide-section-renderer')
  element.setAttribute('class', 'style-scope ytd-guide-renderer')

  return element
}

export const CollectionsSection: Preact.FunctionComponent = (props) => {
  const [portalElement, setPortalElement] = Hooks.useState<HTMLElement | undefined>(undefined)
  const { sectionsElement, subscriptionSectionElement } = useYoutubeStatus()

  Hooks.useLayoutEffect(() => {
    if (sectionsElement !== undefined && subscriptionSectionElement !== undefined) {
      const collectionsSectionElement = newSectionElement()

      sectionsElement.insertBefore(collectionsSectionElement, subscriptionSectionElement)
      collectionsSectionElement.innerHTML = ''

      setPortalElement(collectionsSectionElement)
    }
  }, [sectionsElement, subscriptionSectionElement])

  return portalElement !== undefined
    ? createPortal(<Fragment>{props.children}</Fragment>, portalElement)
    : null
}
