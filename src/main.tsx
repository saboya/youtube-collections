import * as React from 'react'
import { render } from 'react-dom'

import YT from './components/YT'
import useCollections from './hooks/useCollections'
import { CollectionsSection } from './components/CollectionsSection'

const collectionIcon = require('../collections-48.png')

/*__TYPE__: "content"*/
/*__MATCHES__: ["https://www.youtube.com/*"]*/
/*__RUN_AT__: "document_end"*/

const renderRoot = document.createElement('div')

const documentFragment = document
  .createDocumentFragment()

documentFragment.getRootNode()

documentFragment.appendChild(renderRoot)

render(
  <CollectionsSection>
    {() => {
      const [collections] = useCollections()

      return <>
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
      </>
    }}
  </CollectionsSection>,
  renderRoot,
)
