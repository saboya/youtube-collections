import React from 'react'
import { render } from 'react-dom'
import App from './App'

/* __TYPE__: "content" */
/* __MATCHES__: ["https://www.youtube.com/*"] */
/* __RUN_AT__: "document_end" */

const renderRoot = document.createElement('div')

const documentFragment = document
  .createDocumentFragment()

documentFragment.getRootNode()

documentFragment.appendChild(renderRoot)

// @ts-ignore
render(<App />, renderRoot)
