interface Collection {
  id: string
  label: string
  counter: number
}

export type useCollectionsReturn = [Collection[]] & {
  collections: Collection[],
}

export const useCollections: () => useCollectionsReturn = () => {
  const collections = [] as Collection[]

  // Can't type this shit correctly in Typescript
  const temp = [collections] as any
  temp.collections = collections

  return temp
}

export default useCollections
