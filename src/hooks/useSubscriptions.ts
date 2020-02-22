import * as Hooks from 'preact/hooks'
import useYoutubeStatus from './useYoutubeStatus'
import { findSubscriptions } from '../components/YT/Util'
import { YouTube } from '../components/YT'

export type useSubscritionsReturn = [YouTube.SubscriptionGuideEntryRenderer[]]

export const useSubscritions: () => useSubscritionsReturn = () => {
  const [subscriptions, setSubscriptions] = Hooks.useState<YouTube.SubscriptionGuideEntryRenderer[]>([])
  const { ytInitialGuideData } = useYoutubeStatus()

  Hooks.useEffect(() => {
    if (ytInitialGuideData !== undefined) {
      setSubscriptions(findSubscriptions(ytInitialGuideData))
    }
  }, [ytInitialGuideData])

  // Can't type this shit correctly in Typescript
  return Hooks.useMemo(() => [subscriptions], [subscriptions])
}

export default useSubscritions
