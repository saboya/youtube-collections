/** @jsx h */
import Preact, { h, Fragment } from 'preact'
import * as Hooks from 'preact/hooks'
import { createPortal } from 'preact/compat'
import { useSectionsElement } from './YT/hooks/useSectionsElement'
import { useSubscritionsSectionElement } from './YT/hooks/useSubscriptionsSectionElement'

const newSectionElement: () => HTMLElement = () => {
  const element = document.createElement('ytd-guide-section-renderer')
  element.setAttribute('class', 'style-scope ytd-guide-renderer')

  return element
}

export const CollectionsSection: Preact.FunctionComponent = (props) => {
  const [portalElement, setPortalElement] = Hooks.useState<HTMLElement | undefined>(undefined)
  const sectionsElement = useSectionsElement()
  const subscriptionSectionElement = useSubscritionsSectionElement()

  Hooks.useLayoutEffect(() => {
    if (sectionsElement !== null && subscriptionSectionElement !== null) {
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
