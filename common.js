'use strict'

const __db = storage.get(null)
const __collections = __db.then(items => {
  return Object.keys(items).filter(k => k.indexOf('collection-') === 0).map(k => {
    return { [k.substring('collection-'.length)]: items[k] }
  }).reduce((collections,collection) => Object.assign(collections,collection),{})
})
const __subscriptions = __db.then(items => {
  return Object.keys(items).filter(k => k.indexOf('subscription-') === 0).map(k => {
    return { [k.substring('subscription-'.length)]: items[k] }
  }).reduce((subscriptions,sub) => Object.assign(subscriptions,sub),{})
})

function _addCollection(name) {
  __collections.then(collections => {
    var newId = HashID.generate()
    
    while(collections[newId] !== undefined) {
      newId = HashID.generate()
    }

    return storage.set({
      ['collection-'+newId]: {
        name: name
      }
    })
  })
}

function _removeCollection(id) {
  return __subscriptions.then(s => {
    return storage.remove(
      Object.keys(s).filter(k => s[k].collectionId === id).map(k => 'subscription-'+k).concat('collection-'+id)
    )
  })
}

function _addSubscription(subId,collectionId) {
  return storage.set({ ['subscription-'+subId]: collectionId })
}

function _removeSubscription(id) {
  return storage.remove('subscription-'+id)
}

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
      collectionId: subscriptions[channelId] || null,
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
.then(() => {
  chrome.storage.onChanged.addListener((changes,area) => {
    var postEvent = (type,data) => {
      window.postMessage(Object.assign(data,{ type: type }), '*')
    }
    Object.keys(changes).map(k => {
      if(changes[k].newValue === undefined) {
        // Removal events
        if(k.indexOf('collection') === 0) {
          postEvent('COLLECTION_REMOVED',{
            id: k.substring('collection-'.length),
            name: changes[k].oldValue.name
          })
        } else if(k.indexOf('subscription') === 0) {
          postEvent('SUBSCRIPTION_REMOVED',{
            subscriptionId: k.substring('subscription-'.length),
            collectionId: changes[k].oldValue
          })
        }
      } else if(changes[k].oldValue === undefined) {
        // Add events
        if(k.indexOf('collection') === 0) {
          postEvent('COLLECTION_ADDED',{
            id: k.substring('collection-'.length),
            name: changes[k].newValue.name
          })
        } else if(k.indexOf('subscription') === 0) {
          postEvent('SUBSCRIPTION_ADDED',{
            subscriptionId: k.substring('subscription-'.length),
            collectionId: changes[k].newValue
          })
        }
      } else {
        // Update events
        if(k.indexOf('collection') === 0) {
          postEvent('COLLECTION_UPDATED',{
            collectionId: k.substring('collection-'.length),
            oldValue: changes[k].oldValue,
            newValue: changes[k].newValue
          })
        } else if(k.indexOf('subscription') === 0) {
          postEvent('SUBSCRIPTION_UPDATED',{
            subscriptionId: k.substring('subscription-'.length),
            oldValue: changes[k].oldValue,
            newValue: changes[k].newValue
          })
        }
      }
    })
  })
})