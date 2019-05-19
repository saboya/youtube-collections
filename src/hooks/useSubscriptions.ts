interface Subscription {}

export type useSubscritionsReturn = [Subscription] & {
  subscriptions: Subscription[],
}

export const useSubscritions: () => useSubscritionsReturn = () => {
  const subscriptions = [] as Subscription[]

  // Can't type this shit correctly in Typescript
  const temp = [subscriptions] as any
  temp.subscriptions = subscriptions

  return temp
}

export default useSubscritions
