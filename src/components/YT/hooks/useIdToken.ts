import useInjectScript from './useInjectScript'

const getYtToken = (): string => window.yt.config_.ID_TOKEN

export const useIdToken: () => string | undefined = () => {
  const idToken = useInjectScript(getYtToken)

  return idToken
}
