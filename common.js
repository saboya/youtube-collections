'use strict'

const __collections = storage.get('collections').then(item => {
  return item.collections
})
const __subscriptions = storage.get('subscriptions').then(item => {
  return item.subscriptions
})

function _getGuideSection() {
  return document.querySelector('#guide-subscriptions-section')
}

function _getSubscriptionsSection () {
  var _guide_element = document.querySelector('#guide')
  return new Promise((resolve, reject) => {
    if (_getGuideSection() !== null) {
      resolve(_getGuideSection())
    } else {
      var observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.target === _guide_element) {
            observer.disconnect()
            observer.takeRecords()
            if (_getGuideSection() !== null) {
              resolve(_getGuideSection())
            } else {
              reject('Subscriptions not found in Guide')
            }
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
  })
}

Promise.all([
  _getSubscriptionsSection(),
  __collections,
  __subscriptions
]).then(valueArr => {
  var subSection = valueArr[0]
  var collections = valueArr[1]
  var subscriptions = valueArr[2]

  subSection.querySelectorAll('#guide-channels > li.guide-channel').forEach(node => {
    let channelId = node.querySelector('a').getAttribute('data-external-id')
    subscriptions[channelId] = {
      id: channelId,
      count: node.querySelector('span.no-count') ? 0 : parseInt(node.querySelector('.guide-count-value').textContent),
      name: node.querySelector('a.guide-item').getAttribute('title'),
      collection: subscriptions[channelId] !== undefined ? collections[subscriptions[channelId]] : null
    }

    if(subscriptions[channelId].collection !== null) {
      if(subscriptions[channelId].collection.count === undefined) {
        subscriptions[channelId].collection.count = 0
      }
      subscriptions[channelId].collection.count += subscriptions[channelId].count
    }
  })
})