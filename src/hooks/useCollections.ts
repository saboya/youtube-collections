interface Collection {
  label: string
  counter: number
  subscriptions: string[]
}

export const useCollections: () => Collection[] = () => {
  const collections: Collection[] = [{
    label: 'Mashups',
    counter: 0,
    subscriptions: ['UC-_SoG6x0XvcQRgQEh7Ce9Q', 'UC9ecwl3FTG66jIKA9JRDtmg'],
  }]

  return collections
}

export default useCollections
