import * as React from 'react'

import useElementReady from './useElementReady'
import useInjectScript from './useInjectScript'

type useYoutubeStatusReturn = {
  idToken: string | undefined,
  isDarkTheme: boolean,
  guideRendererElement: Element | undefined,
  sectionsElement: Element | undefined,
  subscriptionSectionElement: Element | undefined,
  ytdAppElement: Element | undefined,
}

declare global {
  const yt: {
    config_: {
      ID_TOKEN: string,
    },
  }
}

export const useYoutubeStatus: () => useYoutubeStatusReturn = () => {
  const [idToken] = useInjectScript(() => yt.config_.ID_TOKEN)

  const isDarkTheme = document.documentElement.getAttribute('dark') !== null

  const [ytdAppElement] = useElementReady({
    mutationCallback: () => document.querySelector('ytd-app') || undefined,
    targetNode: document.querySelector('body'),
  })

  const [guideRendererElement] = useElementReady({
    mutationCallback: () => document.getElementById('guide-renderer') || undefined,
    targetNode: document.getElementById('guide-inner-content'),
  })

  const getSubscriptionsSectionElement = React.useCallback(() => {
    const elem = Array
      .from(document.querySelectorAll(
        '#guide-renderer > #sections > ytd-guide-section-renderer > h3 > #guide-section-title',
      ))
      .find(elem => elem.innerHTML === 'Subscriptions')

    if (elem !== undefined) {
      return elem.closest('ytd-guide-section-renderer') || undefined
    }

    return undefined
  }, [])

  const [sectionsElement] = useElementReady({
    mutationCallback: () => document.querySelector('#guide-inner-content > ytd-guide-renderer #sections') || undefined,
    targetNode: guideRendererElement || null,
  })

  const [subscriptionSectionElement] = useElementReady({
    mutationCallback: getSubscriptionsSectionElement,
    targetNode: sectionsElement || null,
  })

  return {
    idToken,
    isDarkTheme,
    guideRendererElement,
    sectionsElement,
    subscriptionSectionElement,
    ytdAppElement,
  }
}

export default useYoutubeStatus
