import * as Hooks from 'preact/hooks'

import { findGuideRendererSubscriptions } from '../Util'
import { useInitialGuideData } from './useInitialGuideData'
import { YouTube } from '../types'

interface Subscription {
  title: string
  hasNewContent: boolean
  isLive: boolean
  thumbnail: string
}

export const useSubscriptions: () => Subscription[] = () => {
  const [subscriptions, setSubscriptions] = Hooks.useState<Subscription[]>([])
  const ytInitialGuideData = useInitialGuideData()

  Hooks.useEffect(() => {
    if (ytInitialGuideData !== undefined) {
      // console.log(findGuideRendererSubscriptions(ytInitialGuideData))
      setSubscriptions(findGuideRendererSubscriptions(ytInitialGuideData).map<Subscription>(s => ({
        title: s.guideEntryRenderer.title,
        hasNewContent: s.guideEntryRenderer.presentationStyle === YouTube.GuideEntryPresentationStyle.NEW_CONTENT,
        isLive: s.guideEntryRenderer.badges?.liveBroadcasting ?? false,
        thumbnail: s.guideEntryRenderer.thumbnail.thumbnails.map(t => t.url)[0],
      })))
    }
  }, [ytInitialGuideData])

  return subscriptions
}
