'use strict'

const _guideLoaded = new Promise((resolve,reject) => {
  if (document.getElementById('guide-container') !== null) {
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

  var id = ''

  if(getLikePlaylistElement() !== null) {
    id = getLikePlaylistElement().closest('a')
      .getAttribute('href').split('=').pop()
  }

  return id
})

const _channelId = _guideLoaded.then(node => {
  function getLikePlaylistElement() {
    return node.querySelector('.guide-my-channel-icon')
  }

  var id = ''

  if(getLikePlaylistElement() !== null) {
    id = getLikePlaylistElement().closest('a')
      .getAttribute('href').split('/').pop()
  }

  return id
})

const _userId = new Promise((resolve,reject) => {
  return Promise.all([
    _tokenId,
    _likePlaylistId,
    _channelId
  ])
  .then(arr => {
    return storage.get([
      'idToken:'+arr[0],
      'idLikePlaylist:'+arr[1],
      'idChannel:'+arr[2]
    ])
    .then(values => {
      if(Object.keys(values).length === 0) {
      }
      console.log(values)
    })
  })
})

var PREFIX

_likePlaylistId.then(prefix => {
  PREFIX = prefix
})

function _getCollections() {
  return _likePlaylistId.then(prefix => {
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
  return _likePlaylistId.then(prefix => {
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
  return _guideLoaded.then(guide => {
    return document.getElementById('guide-subscriptions-section')
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