import * as React from 'react'
import { render } from 'react-dom'

import YT from './components/YT'
import { useSubscritions } from './hooks/useSubscriptions'
import { useCollections } from './hooks/useCollections'
import { GuideSection } from './components/GuideSection'
import { GuideLoaded } from './components/GuideLoaded'

const collectionIcon = require('../icons/collections-48.png')

/*__TYPE__: "content"*/
/*__MATCHES__: ["https://www.youtube.com/*"]*/
/*__RUN_AT__: "document_idle"*/

const renderRoot = document.createElement('div')

const documentFragment = document
  .createDocumentFragment()

documentFragment.getRootNode()

documentFragment.appendChild(renderRoot)

render(
  <GuideLoaded render={() => {
    const [subscriptions] = useSubscritions()
    const [collections] = useCollections()

    console.log(subscriptions)

    return (
      <GuideSection>
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
        <YT.DropDown left='100px' top='100px' isOpen={true}>
          {collections.map((collection, i) => (
            <YT.DropDown.Item key={i} checked={true}>
              {collection.label}
            </YT.DropDown.Item>
          ))}
        </YT.DropDown>
      </GuideSection>
    )
  }} />,
  renderRoot,
)
