import useElementReady from './useElementReady'
import { useSectionsElement } from './useSectionsElement'

const findSubscriptionsSectionElement = (): Element | null => Array
  .from(document.querySelectorAll(
    '#guide-renderer > #sections > ytd-guide-section-renderer > h3 > #guide-section-title',
  ))
  .find(elem => elem.innerHTML === 'Subscriptions')
  ?.closest('ytd-guide-section-renderer') ?? null

export const useSubscritionsSectionElement: () => Element | null = () => {
  const sectionsElement = useSectionsElement()

  const subscriptionSectionElement = useElementReady({
    mutationCallback: findSubscriptionsSectionElement,
    targetNode: sectionsElement,
  })

  return subscriptionSectionElement
}
