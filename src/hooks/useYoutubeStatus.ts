import * as React from 'react'

import useElementReady from './useElementReady'

type useYoutubeStatusReturn = {
  idToken: string,
  isDarkTheme: boolean,
  guideRendererElement: Element | undefined,
  sectionsElement: Element | undefined,
  subscriptionSectionElement: Element | undefined,
  ytdAppElement: Element | undefined,
}

export const useYoutubeStatus: () => useYoutubeStatusReturn = () => {
  const idToken = ''

  const isDarkTheme = document.documentElement.getAttribute('dark') !== null

  const [ytdAppElement] = useElementReady({
    mutationCallback: () => document.querySelector('ytd-app') || undefined,
    targetNode: document.querySelector('body'),
  })

  const [guideRendererElement] = useElementReady({
    mutationCallback: () => document.querySelector('#guide-inner-content > ytd-guide-renderer') || undefined,
    targetNode: document.querySelector('guide-inner-content') as HTMLBodyElement,
  })

  const getSubscriptionsSectionElement = React.useCallback(() => {
    return Array
      .from(document.querySelectorAll(
        '#guide-renderer > #sections > ytd-guide-section-renderer > h3 > #guide-section-title > a',
      ))
      .find(elem => elem.innerHTML === 'Subscriptions')
  }, [])

  const [subscriptionSectionElement] = useElementReady({
    mutationCallback: getSubscriptionsSectionElement,
    targetNode: document.getElementById('sections'),
  })

  return {
    idToken,
    isDarkTheme,
    guideRendererElement,
    sectionsElement: document.getElementById('sections') || undefined,
    subscriptionSectionElement: subscriptionSectionElement,
    ytdAppElement,
  }
}

export default useYoutubeStatus
