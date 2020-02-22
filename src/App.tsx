/** @jsx h */
import Preact, { h } from 'preact'

import useCollections from './hooks/useCollections'
import { CollectionsSection } from './components/CollectionsSection'
import YT from './components/YT'
import useSubscritions from './hooks/useSubscriptions'

const collectionIcon = require('../collections-48.png')

const App: Preact.FunctionComponent = () => {
  const [collections] = useCollections()
  const [subscriptions] = useSubscritions()

  console.log(subscriptions)

  return <CollectionsSection>
    <YT.Guide.SectionTitle>
      Collections
    </YT.Guide.SectionTitle>
    <YT.Guide.SectionItems>
      {collections.map((collection, i) => (
        <YT.Guide.SectionItem
          key={i}
          label={collection.label}
          image={collectionIcon}
          uri={'#'}
          counter={collection.counter}
        />
      ))}
    </YT.Guide.SectionItems>
  </CollectionsSection>
}

export default App
