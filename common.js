'use strict'

function _getCollections() {
  return storage.get(null).then(items => {
    return Object.keys(items).filter(k => k.indexOf('collection-') === 0).map(k => {
      return { [k.substring('collection-'.length)]: items[k] }
    }).sort((a,b) => {
      var id1 = Object.keys(a)[0]
      var id2 = Object.keys(b)[0]
      return (a[id1].name<b[id2].name?-1:(a[id1].name>b[id2].name?1:0))
    })
    .reduce((collections,collection) => Object.assign(collections,collection),{})
  })
}

function _getSubscriptions() {
  return storage.get(null).then(items => {
    return Object.keys(items).filter(k => k.indexOf('subscription-') === 0).map(k => {
      return { [k.substring('subscription-'.length)]: items[k] }
    }).reduce((subscriptions,sub) => Object.assign(subscriptions,sub),{})
  })
}

function _addCollection(name) {
  return _getCollections().then(collections => {
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
  return _getSubscriptions().then(s => {
    return storage.remove(
      Object.keys(s).filter(k => s[k] === id).map(k => 'subscription-'+k).concat('collection-'+id)
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