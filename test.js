'use strict'

const _guide_element = document.querySelector('#guide')

function init () {
  if(_guide_element !== null) {
    if(document.querySelectorAll('#guide-subscriptions-section').length === 0) {

      var observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if(mutation.type === 'childList' && mutation.target === _guide_element) {
            observer.disconnect()
            observer.takeRecords()
            document.dispatchEvent(new CustomEvent('GUIDE_SUBSCRIPTIONS_LOADED', { "detail": document.querySelector('#guide-channels') }))
          }
        })
      })

      observer.observe(_guide_element, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      })
    }
    else {
      document.dispatchEvent(new CustomEvent('GUIDE_SUBSCRIPTIONS_LOADED', { "detail": document.querySelector('#guide-channels') }))
    }
  }


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

// Add an event listener
document.addEventListener('GUIDE_SUBSCRIPTIONS_LOADED',event => {
  event.detail.querySelectorAll('li.guide-channel').forEach(elem => {
    var channel = {
      id: elem.getAttribute('id').slice(0,24),
      count: elem.querySelector('span.no-count') ? 0 : parseInt(elem.querySelector('.guide-count-value').textContent)
    }
  })
})

init()