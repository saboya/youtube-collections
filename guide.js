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
    return Object.keys(collections).map(id => {
      return template.render('guide-section-item',{
        name: collections[id].name,
        count: collections[id].count
      }).then(html => {
        var elem = document.createElement('li')
        node.appendChild(elem)
        elem.outerHTML = html
      })
    })
  })
})
