'use strict'

const _guideLoaded = new Promise((resolve,reject) => {
  if (document.getElementById('guide-subscriptions-section') !== null) {
    resolve(document.getElementById('guide-container'))
  } else {
    var _guide_element = document.querySelector('#guide')
    var observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.target === _guide_element) {
          observer.disconnect()
          observer.takeRecords()
          resolve(document.getElementById('guide-container'))
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

const _tokenId = _pageRequest('GET_TOKEN_ID')

const _likePlaylistId = _guideLoaded.then(node => {
  function getLikePlaylistElement() {
    return node.querySelector('.guide-likes-playlist-icon')
  }

  var id = null

  if(getLikePlaylistElement() !== null) {
    id = getLikePlaylistElement().closest('a')
      .getAttribute('href').split('=').pop()
  }

  return id
})

const _channelId = _guideLoaded.then(node => {
  function getMyChannelElement() {
    return node.querySelector('.guide-my-channel-icon')
  }

  var id = null

  if(getMyChannelElement() !== null) {
    id = getMyChannelElement().closest('a')
      .getAttribute('href').split('/').pop()
  }

  return id
})

const _userId = Promise.all([
  _tokenId,
  _likePlaylistId,
  _channelId
])
.then(arr => {
  var keys = []
  arr[0] !== null && keys.push('idToken:'+arr[0])
  arr[1] !== null && keys.push('idLikePlaylist:'+arr[1])
  arr[2] !== null && keys.push('idChannel:'+arr[2])

  if(keys.length === 0) {
    throw('Nenhuma chave encontrada para diferenciar o usuario')
  }

  return storage.get([
    'idToken:'+arr[0],
    'idLikePlaylist:'+arr[1],
    'idChannel:'+arr[2]
  ])
  .then(values => {
    var savedKeys = Object.keys(values)
    var keysToSave = []

    var id
    if(savedKeys.length === 0) {
      id = HashID.generate()
      keysToSave = keys
    }
    else {
      if(savedKeys.length < keys) {
        keysToSave = keys.filter(k => !savedKeys,includes(k))
      }
      id = values[savedKeys[0]]
    }
    return storage.set(keysToSave.map(k => ({ [k]: id })).reduce((p,c) => Object.assign(p,c),{})).then(() => id)
  })
})

function _getCollectionKey(collectionId) {
  return _userId.then(userId => userId+':collection:'+collectionId)
}

function _getSubscriptionKey(subscriptionId) {
  return _userId.then(userId => userId+':subscription:'+subscriptionId)
}

function _getCollections() {
  return _userId.then(prefix => {
    return storage.get(null).then(items => {
      return Object.keys(items).filter(k => k.indexOf(prefix+':collection') === 0).map(k => {
        return { [k.substring((prefix+':collection:').length)]: items[k] }
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
  return _userId.then(prefix => {
  return storage.get(null).then(items => {
    return Object.keys(items).filter(k => k.indexOf(prefix+':subscription') === 0).map(k => {
      return { [k.substring((prefix+':subscription:').length)]: items[k] }
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
    _getCollectionKey(newId).then(key => {
      return storage.set({
        [key]: {
          name: name
        }
      })
    })
  })
}

function _removeCollection(id) {
  return _getSubscriptions().then(s => {
    return Promise.all(
      Object.keys(s).filter(k => s[k] === id).map(k => {
        return _getSubscriptionKey(k)
      }).concat(_getCollectionKey(id))
    )
    .then(valueArr => {
      return storage.remove(valueArr)
    })
  })
}

function _addSubscription(subId,collectionId) {
  return _getSubscriptionKey(subId).then(key => storage.set({ [key]: collectionId }))
}

function _removeSubscription(id) {
  return _getSubscriptionKey(id).then(key => storage.remove(key))
}

function _getGuideSection() {
  return _guideLoaded.then(guide => {
    return document.getElementById('guide-subscriptions-section')
  })
}

_userId.then(userId => {
var collectionPrefix = userId+':collection:'
var subscriptionPrefix = userId+':subscription:'

chrome.storage.onChanged.addListener((changes,area) => {
  var postEvent = (type,data) => {
    window.postMessage(Object.assign(data,{ type: type }), '*')
  }
  Object.keys(changes).map(k => {
    if(changes[k].newValue === undefined) {
      // Removal events
      if(k.indexOf(collectionPrefix) === 0) {
        postEvent('COLLECTION_REMOVED',{
          id: k.substring((collectionPrefix).length),
          name: changes[k].oldValue.name
        })
      } else if(k.indexOf(subscriptionPrefix) === 0) {
        postEvent('SUBSCRIPTION_REMOVED',{
          subscriptionId: k.substring((subscriptionPrefix).length),
          collectionId: changes[k].oldValue
        })
      }
    } else if(changes[k].oldValue === undefined) {
      // Add events
      if(k.indexOf(collectionPrefix) === 0) {
        postEvent('COLLECTION_ADDED',{
          id: k.substring((collectionPrefix).length),
          name: changes[k].newValue.name
        })
      } else if(k.indexOf(subscriptionPrefix) === 0) {
        postEvent('SUBSCRIPTION_ADDED',{
          subscriptionId: k.substring((subscriptionPrefix).length),
          collectionId: changes[k].newValue
        })
      }
    } else {
      // Update events
      if(k.indexOf(collectionPrefix) === 0) {
        postEvent('COLLECTION_UPDATED',{
          collectionId: k.substring((collectionPrefix).length),
          oldValue: changes[k].oldValue,
          newValue: changes[k].newValue
        })
      } else if(k.indexOf(subscriptionPrefix) === 0) {
        postEvent('SUBSCRIPTION_UPDATED',{
          subscriptionId: k.substring((subscriptionPrefix).length),
          oldValue: changes[k].oldValue,
          newValue: changes[k].newValue
        })
      }
    }
  })
})
})
