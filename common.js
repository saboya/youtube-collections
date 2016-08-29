'use strict'

var PREFIX

const __prefix_promise = new Promise((resolve,reject) => {
  function getLikePlaylistElement() {
    return document.querySelector('#guide-container .guide-likes-playlist-icon')
  }

  function endPromise() {
    if(getLikePlaylistElement() === null) {
      reject('No like playlist id found')
    }
    else {
      resolve(getLikePlaylistElement().closest('a')
        .getAttribute('href').split('=').pop())
    }
  }

  if (_getGuideSection() !== null) {
    endPromise()
  } else {
    var _guide_element = document.querySelector('#guide')
    var observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.target === _guide_element) {
          observer.disconnect()
          observer.takeRecords()
          endPromise()
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

__prefix_promise.then(prefix => {
  PREFIX = prefix
})

function _getCollections() {
  return __prefix_promise.then(prefix => {
  return storage.get(null).then(items => {
    return Object.keys(items).filter(k => k.indexOf('collection-'+PREFIX) === 0).map(k => {
      return { [k.substring(('collection-'+PREFIX+'-').length)]: items[k] }
    }).sort((a,b) => {
      var id1 = Object.keys(a)[0]
      var id2 = Object.keys(b)[0]
      return (a[id1].name<b[id2].name?-1:(a[id1].name>b[id2].name?1:0))
    })
    .reduce((collections,collection) => Object.assign(collections,collection),{})
  })
  })
}

function _getSubscriptions() {
  return __prefix_promise.then(prefix => {
  return storage.get(null).then(items => {
    return Object.keys(items).filter(k => k.indexOf('subscription-'+PREFIX) === 0).map(k => {
      return { [k.substring(('subscription-'+PREFIX+'-').length)]: items[k] }
    }).reduce((subscriptions,sub) => Object.assign(subscriptions,sub),{})
  })
  })
}

function _addCollection(name) {
  return _getCollections().then(collections => {
    var newId = HashID.generate()
    
    while(collections[newId] !== undefined) {
      newId = HashID.generate()
    }

    return storage.set({
      ['collection-'+PREFIX+'-'+newId]: {
        name: name
      }
    })
  })
}

function _removeCollection(id) {
  return _getSubscriptions().then(s => {
    return storage.remove(
      Object.keys(s).filter(k => s[k] === id).map(k => {
        return 'subscription-'+PREFIX+'-'+k
      }).concat('collection-'+PREFIX+'-'+id)
    )
  })
}

function _addSubscription(subId,collectionId) {
  return storage.set({ ['subscription-'+PREFIX+'-'+subId]: collectionId })
}

function _removeSubscription(id) {
  return storage.remove('subscription-'+PREFIX+'-'+id)
}

function _getGuideSection() {
  return document.querySelector('#guide-subscriptions-section')
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
          id: k.substring(('collection-'+PREFIX+'-').length),
          name: changes[k].oldValue.name
        })
      } else if(k.indexOf('subscription') === 0) {
        postEvent('SUBSCRIPTION_REMOVED',{
          subscriptionId: k.substring(('subscription-'+PREFIX+'-').length),
          collectionId: changes[k].oldValue
        })
      }
    } else if(changes[k].oldValue === undefined) {
      // Add events
      if(k.indexOf('collection') === 0) {
        postEvent('COLLECTION_ADDED',{
          id: k.substring(('collection-'+PREFIX+'-').length),
          name: changes[k].newValue.name
        })
      } else if(k.indexOf('subscription') === 0) {
        postEvent('SUBSCRIPTION_ADDED',{
          subscriptionId: k.substring(('subscription-'+PREFIX+'-').length),
          collectionId: changes[k].newValue
        })
      }
    } else {
      // Update events
      if(k.indexOf('collection') === 0) {
        postEvent('COLLECTION_UPDATED',{
          collectionId: k.substring(('collection-'+PREFIX+'-').length),
          oldValue: changes[k].oldValue,
          newValue: changes[k].newValue
        })
      } else if(k.indexOf('subscription') === 0) {
        postEvent('SUBSCRIPTION_UPDATED',{
          subscriptionId: k.substring(('subscription-'+PREFIX+'-').length),
          oldValue: changes[k].oldValue,
          newValue: changes[k].newValue
        })
      }
    }
  })
})