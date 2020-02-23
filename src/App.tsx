/** @jsx h */
import Preact, { h } from 'preact'

import useCollections from './hooks/useCollections'
import { CollectionsSection } from './components/CollectionsSection'
import YT from './components/YT'

const collectionIcon = require('../collections-48.png')

const App: Preact.FunctionComponent = () => {
  const collections = useCollections()

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
