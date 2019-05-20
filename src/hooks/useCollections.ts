interface Collection {
  label: string
  counter: number
  subscriptions: string[]
}

export type useCollectionsReturn = [Collection[]] & {
  collections: Collection[],
}

export const useCollections: () => useCollectionsReturn = () => {
  const collections: Collection[] = [{
    label: 'Mashups',
    counter: 0,
    subscriptions: ['UC-_SoG6x0XvcQRgQEh7Ce9Q', 'UC9ecwl3FTG66jIKA9JRDtmg'],
  }]

  const temp = [collections] as any
  temp.collections = collections

  return temp
}

export default useCollections
