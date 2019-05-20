const elementReady = async (mutationCallback: () => Element | undefined, targetNode: Node | null) => {
  return new Promise<Element>((resolve, reject) => {
    let element = mutationCallback()

    if (element !== undefined) {
      resolve(element)
      return
    }

    const handler: MutationCallback = (records, observer) => {
      element = mutationCallback()
      if (element !== undefined) {
        observer.disconnect()
        observer.takeRecords()
        resolve(element)
      }
    }

    if (targetNode !== null) {
      const observer = new MutationObserver(handler)

      observer.observe(targetNode, {childList: true})
    }
  })
}

const getSubscriptionsSectionElement = () => {
  const elem = Array
    .from(document.querySelectorAll(
      '#guide-renderer > #sections > ytd-guide-section-renderer > h3 > #guide-section-title',
    ))
    .find(elem => elem.innerHTML === 'Subscriptions')

  if (elem !== undefined) {
    return elem.closest('ytd-guide-section-renderer') || undefined
  }

  return undefined
}

const newSectionElement = () => {
  const element = document.createElement('ytd-guide-section-renderer')
  element.setAttribute('class', 'style-scope ytd-guide-renderer')

  return element
}

export const setupRenderRoot = async () => {
  const guideRendererElement = await elementReady(
    () => document.getElementById('guide-renderer') || undefined,
    document.getElementById('guide-inner-content'),
  )

  const sectionsElement = await elementReady(
    () => document.querySelector('#guide-inner-content > ytd-guide-renderer #sections') || undefined,
    guideRendererElement || null,
  )

  const subscriptionSectionElement = await elementReady(
    getSubscriptionsSectionElement,
    sectionsElement || null,
  )

  const collectionsSectionElement = newSectionElement()

  sectionsElement.insertBefore(collectionsSectionElement, subscriptionSectionElement)

  return collectionsSectionElement
}
