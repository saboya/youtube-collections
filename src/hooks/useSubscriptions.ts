import React from 'react'
import useYoutubeStatus from './useYoutubeStatus'
import { findSubscriptions } from '../components/YT/Util'
import { YouTube } from '../components/YT'

export type useSubscritionsReturn = [YouTube.SubscriptionGuideEntryRenderer[]]

export const useSubscritions: () => useSubscritionsReturn = () => {
  const [subscriptions, setSubscriptions] = React.useState<YouTube.SubscriptionGuideEntryRenderer[]>([])
  const { ytInitialGuideData } = useYoutubeStatus()

  React.useEffect(() => {
    if (ytInitialGuideData !== undefined) {
      setSubscriptions(findSubscriptions(ytInitialGuideData))
    }
  }, [ytInitialGuideData])

  // Can't type this shit correctly in Typescript
  return React.useMemo(() => [subscriptions], [subscriptions])
}

export default useSubscritions
