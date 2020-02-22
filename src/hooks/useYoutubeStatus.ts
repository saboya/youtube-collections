import * as Hooks from 'preact/hooks'

import useElementReady from './useElementReady'
import useInjectScript from './useInjectScript'
import { YouTube } from '../components/YT'

interface useYoutubeStatusReturn {
  idToken: string | undefined
  ytInitialGuideData: YouTube.InitialGuideData | undefined
  isDarkTheme: boolean
  guideRendererElement: Element | undefined
  sectionsElement: Element | undefined
  subscriptionSectionElement: Element | undefined
  ytdAppElement: Element | undefined
}

const getYtToken = (): string => window.yt.config_.ID_TOKEN

const getYtInitialGuideData = (): YouTube.InitialGuideData => window.ytInitialGuideData

export const useYoutubeStatus: () => useYoutubeStatusReturn = () => {
  const idToken = useInjectScript(getYtToken)

  const ytInitialGuideData = useInjectScript(getYtInitialGuideData)

  const isDarkTheme = document.documentElement.getAttribute('dark') !== null

  const ytdAppElement = useElementReady({
    mutationCallback: () => document.querySelector('ytd-app') ?? undefined,
    targetNode: document.querySelector('body'),
  })

  const guideRendererElement = useElementReady({
    mutationCallback: () => document.getElementById('guide-renderer') ?? undefined,
    targetNode: document.getElementById('guide-inner-content'),
  })

  const getSubscriptionsSectionElement = Hooks.useCallback(() => {
    const elem = Array
      .from(document.querySelectorAll(
        '#guide-renderer > #sections > ytd-guide-section-renderer > h3 > #guide-section-title',
      ))
      .find(elem => elem.innerHTML === 'Subscriptions')

    return elem?.closest('ytd-guide-section-renderer') ?? undefined
  }, [])

  const sectionsElement = useElementReady({
    mutationCallback: () => document.querySelector('#guide-inner-content > ytd-guide-renderer #sections') ?? undefined,
    targetNode: guideRendererElement ?? null,
  })

  const subscriptionSectionElement = useElementReady({
    mutationCallback: getSubscriptionsSectionElement,
    targetNode: sectionsElement ?? null,
  })

  return {
    idToken,
    ytInitialGuideData,
    isDarkTheme,
    guideRendererElement,
    sectionsElement,
    subscriptionSectionElement,
    ytdAppElement,
  }
}

export default useYoutubeStatus
