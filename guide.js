'use strict'

Promise.all([
  _getGuideSection(),
  _getCollections(),
  _getSubscriptions()
]).then(valueArr => {
  var guideSection = valueArr[0]
  var collections = valueArr[1]
  var subscriptions = valueArr[2]

  var _getSubscriptionCount = function(id) {
    var guideItem = document.getElementById(id+'-guide-item')
    return guideItem.querySelector('span.no-count') ? 0 : parseInt(guideItem.querySelector('.guide-count-value').textContent)
  }

  var _getCollectionCount = function(id) {
    return Object.keys(subscriptions).filter(k => {
        return (_getSubscriptionGuideItem(k) !== null)
          && (subscriptions[k] == id)
      })
      .map(k => _getSubscriptionCount(k)).reduce((p,c) => p+c,0)
  }

  var _getCollectionGuideItem = function(id) {
    return document.getElementById(id+'-collection-guide-item')
  }

  var _getSubscriptionGuideItem = function(id) {
    return document.getElementById(id+'-guide-item')
  }

  var _renderGuideCollectionItem = function(id,name) {
    return template.render('guide-section-item',{
      id: id,
      name: name,
      count: function(count) { return count === 0 ? '':count; }(_getCollectionCount(id))
    }).then(html => {
      var elem = document.createElement('li')
      document.querySelector('#guide-collection-list .guide-channels-list').appendChild(elem)
      elem.outerHTML = html

      Object.keys(subscriptions).filter(key => {
        return (_getSubscriptionGuideItem(key) !== null) &&
          (subscriptions[key] === id)
      }).forEach(key => {
        _cloneSubscriptionItem(key,id)
      })
    })
  }

  var _cloneSubscriptionItem = function(subId,collectionId) {
    var newNode = _getSubscriptionGuideItem(subId).cloneNode(true)
    newNode.removeAttribute('id')
    var thumb = newNode.querySelector('img')
    var imgSrc = thumb.dataset.thumb
    if(imgSrc !== undefined) {
      thumb.setAttribute('src',thumb.dataset.thumb)
    }

    document.getElementById(collectionId+'-guide-channel-list').appendChild(newNode)
  }

  var _updateCollectionListHeight = function(id) {
    var elem = _getCollectionGuideItem(id)
    if(elem.classList.contains('collection-list-open')) {
      var height = 28
      var id = elem.querySelector('.collection-item a').dataset.collectionId
      var listNode = document.getElementById(id+'-guide-channel-list')
      height += listNode.offsetHeight
      elem.style.maxHeight = height+'px'
    }
  }

  template.render('guide-section',{ title:'Collections' }).then(html => {
    var node = document.createElement('li')
    guideSection.parentNode.insertBefore(node,guideSection)
    node.outerHTML = html
    return document.querySelector('#guide-collection-list .guide-channels-list')
  }).then(node => {
    node.addEventListener('click',e => {
      if(e.target.closest('.collection-item a').hasAttribute('data-collection-id')) {
        var height = 28
        if(e.target.closest('.collection-item').classList.toggle('collection-list-open')) {
          var id = e.target.closest('.collection-item a').dataset.collectionId
          var listNode = document.getElementById(id+'-guide-channel-list')
          height += listNode.offsetHeight
        }
        e.target.closest('.collection-item').style.maxHeight = height+'px'
      }
    })

    return document.querySelector('#guide-collection-list .guide-channels-list')
  }).then(node => {
    return Object.keys(collections).map(id => {
      _renderGuideCollectionItem(id,collections[id].name)
    })
  })

  window.addEventListener('message',event => {
    if (event.source != window) {
      return
    }

    if (event.data.type) {
      switch(event.data.type) {
        case 'SUBSCRIPTION_ADDED':
          _cloneSubscriptionItem(event.data.subscriptionId,event.data.collectionId)
          _updateCollectionListHeight(event.data.collectionId)
          break;
        case 'SUBSCRIPTION_REMOVED':
          var elem = _getCollectionGuideItem(event.data.collectionId)
          if(elem) {
            elem.querySelector('a[data-external-id="'+event.data.subscriptionId+'"]').closest('li').remove()
          }
          break;
        case 'SUBSCRIPTION_UPDATED':
          _getCollectionGuideItem(event.data.oldValue)
            .querySelector('a[data-external-id="'+event.data.subscriptionId+'"]').closest('li').remove()
          console.log(event.data)
          _cloneSubscriptionItem(event.data.subscriptionId,event.data.newValue)
          _updateCollectionListHeight(event.data.newValue)
          break;
        case 'COLLECTION_ADDED':
          _renderGuideCollectionItem(event.data.id,event.data.name)
          break;
        case 'COLLECTION_REMOVED':
          _getCollectionGuideItem(event.data.id).remove()
          break;
        case 'COLLECTION_UPDATED':
          break;
      }
    }
  })
})

