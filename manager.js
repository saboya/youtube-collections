'use strict'

function _getSubscriptionContainer() {
  return document.getElementById('subscription-manager-container')
}

Promise.all([
  __collections,
  __subscriptions
]).then(valueArr => {
  var collections = valueArr[0]
  var subscriptions = valueArr[1]

  template.render('manager-section',{ quantity: Object.keys(collections).length }).then(html => {
    var elem = document.createElement('div')
    _getSubscriptionContainer().parentNode.insertBefore(elem,_getSubscriptionContainer())
    elem.outerHTML = html

    return document.getElementById('collections-manager-container')
  }).then(node => {
    var form = document.getElementById('add-collection-form')

    node.addEventListener('click',e => {
      if(e.target.hasAttribute('data-collection-id')) {
        var removedId = e.target.dataset.collectionId
        if(window.confirm('Remove collection '+ collections[removedId].name+'?')) {
          _removeCollection(e.target.dataset.collectionId)
        }
      }
    })

    form.querySelector('input[name="add-collection"]').addEventListener('input',e => {
      e.target.classList.toggle('invalid',!e.target.checkValidity() && e.target.value !== '')
    })

    form.querySelector('input[name="add-collection"]').addEventListener('invalid',e => {
      e.target.classList.add('invalid')
    })

    form.addEventListener('submit',e => {
      _addCollection(form.querySelector('input[name="add-collection"]').value)

      e.preventDefault()
      e.stopPropagation()
      return false
    })

    return document.querySelector('#collection-manager-list tbody')
  }).then(node => {
    return Object.keys(collections).map(id => {
      return template.render('manager-section-item',{
        id: id,
        name: collections[id].name
      }).then(html => {
        var elem = document.createElement('tr')
        node.appendChild(elem)
        elem.outerHTML = html
        return document.getElementById(id+'-manager-collection')
      })
    })
  })

  var buttons

  Promise.all(
    [template.render('manager-subscription-popup-item', { id: '', label: '' })].concat(
    Object.keys(collections).map(k => {
      return template.render('manager-subscription-popup-item', { id: k, label: collections[k].name })
    }))
  ).then(valueArr => {
    buttons = valueArr.join('')
    return Promise.all(Object.keys(collections).map(k => {
      return template.render('manager-subscription-button', { id: k, label: collections[k].name, buttons: buttons }).then(html => {
        return { [collections[k].name]: html }
      })
    }))
  })
  .then(valueArr => {
    return template.render('manager-subscription-button', { id: '', label: '', buttons: buttons }).then(html => {
      valueArr.push({'(none)':html})
      return valueArr.reduce((all,curr) => Object.assign(all,curr),{})
    })
  })
  .then(htmls => {
    let query = '#subscription-manager-list tr.subscription-item td:first-of-type .subscription-title-wrap'
    Array.prototype.slice.call(document.querySelectorAll(query))
    .map(node => {
      var channelId = node.closest('tr').dataset.channelExternalId
      var collection = subscriptions[channelId].collection
      var elem = document.createElement('div')
      node.appendChild(elem)

      if(collection === null) {
        elem.outerHTML = htmls['(none)']
      } else {
        elem.outerHTML = htmls[collection.name]
      }

      node.querySelector('.add-to-collection ul').setAttribute('data-subscription-id',channelId)
    })
  })
})