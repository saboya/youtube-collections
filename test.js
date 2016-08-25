'use strict'

function init () {
  chrome.storage.sync.get('collections', items => {
    console.log(items)
  })

/*if (!collections) {
  console.log('Initializing collections...')
  chrome.storage.sync.set('collections', () => {
    console.log('Collections initialized.')
  })
}*/
}

console.log(document.querySelectorAll('#appbar-guide-menu'))
console.log(document.querySelector('#guide-container'))
console.log(document.querySelectorAll('#guide-subscriptions-section'))
console.log(document.querySelectorAll('#guide-channels li'))

// Setup a new observer to get notified of changes
var observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    console.log(mutation)
  })
})

// Observe a specific DOM node / subtree
observer.observe(document.querySelector('#guide-container'), {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
})

// Stop observing changes
// observer.disconnect()

// Empty the queue of records
// observer.takeRecords()
