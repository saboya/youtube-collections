'use strict'

Promise.all([
  _getSubscriptionsSection(),
  __collections,
  __subscriptions
]).then(valueArr => {
  var subSection = valueArr[0]
  var collections = valueArr[1]
  var subscriptions = valueArr[2]

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
        count: collections[id].count || ''
      }).then(html => {
        var elem = document.createElement('li')
        node.appendChild(elem)
        elem.outerHTML = html

        Object.keys(subscriptions).filter(key => subscriptions[key].collectionId === id).forEach(key => {
          var newNode = document.getElementById(key+'-guide-item').cloneNode(true)
          newNode.removeAttribute('id')
          var thumb = newNode.querySelector('img')
          thumb.setAttribute('src',thumb.dataset.thumb)

          document.getElementById(id+'-guide-channel-list').appendChild(newNode)
        })
      })
    })
  })
})
