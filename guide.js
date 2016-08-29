'use strict'

Promise.all([
  _getCollections(),
  _getSubscriptions()
]).then(valueArr => {
  var collections = valueArr[0]
  var subscriptions = valueArr[1]

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

  var _getSubscriptionGuideItem = function(id) {
    return document.getElementById(id+'-guide-item')
  }

  template.render('guide-section',{ title:'Collections' }).then(html => {
    var node = document.createElement('li')
    _getGuideSection().parentNode.insertBefore(node,_getGuideSection())
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
      return template.render('guide-section-item',{
        id: id,
        name: collections[id].name,
        count: function(count) { return count === 0 ? '':count; }(_getCollectionCount(id))
      }).then(html => {
        var elem = document.createElement('li')
        node.appendChild(elem)
        elem.outerHTML = html

        Object.keys(subscriptions).filter(key => {
          return (_getSubscriptionGuideItem(key) !== null) &&
            (subscriptions[key] === id)
        }).forEach(key => {
          var newNode = _getSubscriptionGuideItem(key).cloneNode(true)
          newNode.removeAttribute('id')
          var thumb = newNode.querySelector('img')
          var imgSrc = thumb.dataset.thumb
          if(imgSrc !== undefined) {
            thumb.setAttribute('src',thumb.dataset.thumb)
          }

          document.getElementById(id+'-guide-channel-list').appendChild(newNode)
        })
      })
    })
  })
})
