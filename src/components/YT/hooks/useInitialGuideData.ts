import useInjectScript from './useInjectScript'
import { YouTube } from '../types'

const getYtInitialGuideData = (): YouTube.InitialGuideData | undefined => window.ytInitialGuideData

/**
 * window['ytInitialGuideDataPresent'] = true;
 */

export const useInitialGuideData: () => YouTube.InitialGuideData | undefined = () => {
  const ytInitialGuideData = useInjectScript(getYtInitialGuideData)

  return ytInitialGuideData
}
