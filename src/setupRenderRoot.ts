type ElementReady = (mutationCallback: () => Element | undefined, targetNode: Node | null) => Promise<Element>

const elementReady: ElementReady = async (mutationCallback, targetNode) => {
  return new Promise<Element>((resolve) => {
    let element = mutationCallback()

    if (element !== undefined) {
      resolve(element)
      return
    }

    const handler: MutationCallback = (_, observer) => {
      element = mutationCallback()
      if (element !== undefined) {
        observer.disconnect()
        observer.takeRecords()
        resolve(element)
      }
    }

    if (targetNode !== null) {
      const observer = new MutationObserver(handler)

      observer.observe(targetNode, { childList: true })
    }
  })
}

const getSubscriptionsSectionElement: () => Element | undefined = () => {
  const elem = Array
    .from(document.querySelectorAll(
      '#guide-renderer > #sections > ytd-guide-section-renderer > h3 > #guide-section-title',
    ))
    .find(elem => elem.innerHTML === 'Subscriptions')

  if (elem !== undefined) {
    return elem.closest('ytd-guide-section-renderer') ?? undefined
  }

  return undefined
}

const newSectionElement: () => HTMLElement = () => {
  const element = document.createElement('ytd-guide-section-renderer')
  element.setAttribute('class', 'style-scope ytd-guide-renderer')

  return element
}

export const setupRenderRoot: () => Promise<HTMLElement> = async () => {
  const guideRendererElement = await elementReady(
    () => document.getElementById('guide-renderer') ?? undefined,
    document.getElementById('guide-inner-content'),
  )

  const sectionsElement = await elementReady(
    () => document.querySelector('#guide-inner-content > ytd-guide-renderer #sections') ?? undefined,
    guideRendererElement ?? null,
  )

  const subscriptionSectionElement = await elementReady(
    getSubscriptionsSectionElement,
    sectionsElement ?? null,
  )

  const collectionsSectionElement = newSectionElement()

  sectionsElement.insertBefore(collectionsSectionElement, subscriptionSectionElement)

  return collectionsSectionElement
}
