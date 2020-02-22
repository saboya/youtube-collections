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

const findYtdAppElement = (): Element | undefined => document.querySelector('ytd-app') ?? undefined

const findGuideRendererElement = (): Element | undefined => document.getElementById('guide-renderer') ?? undefined

const findSectionsElement = (): Element | undefined => document.querySelector('#guide-inner-content > ytd-guide-renderer #sections') ?? undefined

export const useYoutubeStatus: () => useYoutubeStatusReturn = () => {
  const idToken = useInjectScript(getYtToken)

  const ytInitialGuideData = useInjectScript(getYtInitialGuideData)

  const isDarkTheme = document.documentElement.getAttribute('dark') !== null

  const ytdAppElement = useElementReady({
    mutationCallback: findYtdAppElement,
    targetNode: document.querySelector('body'),
  })

  const guideRendererElement = useElementReady({
    mutationCallback: findGuideRendererElement,
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
    mutationCallback: findSectionsElement,
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
