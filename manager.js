'use strict'

function _generatePopupOptions() {
  return _getCollections().then(collections => {
    return Promise.all(
      [template.render('manager-subscription-popup-item', { id: '', label: '' })]
      .concat(Object.keys(collections).map(k => {
        return template.render('manager-subscription-popup-item', { id: k, label: collections[k].name })
      }))
    )
  })
  .then(htmls => {
    return htmls.join('')
  })
}

Promise.all([
  _getCollections(),
  _getSubscriptions()
]).then(valueArr => {
  var collections = valueArr[0]
  var subscriptions = valueArr[1]

  template.render('manager-section',{ quantity: Object.keys(collections).length }).then(html => {
    var _getSubscriptionContainer = function() {
      return document.getElementById('subscription-manager-container')
    }

    var elem = document.createElement('div')
    _getSubscriptionContainer().parentNode.insertBefore(elem,_getSubscriptionContainer())
    elem.outerHTML = html

    return document.getElementById('collections-manager-container')
  }).then(node => {
    var form = document.getElementById('add-collection-form')

    node.addEventListener('click',e => {
      if(e.target.hasAttribute('data-collection-id')) {
        var removedId = e.target.dataset.collectionId
        if(window.confirm('Remove collection '+ e.target.closest('tr').querySelector('.subscription-title').getAttribute('title') +'?')) {
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

  _generatePopupOptions().then(buttonsHtml => {
    return Promise.all(
      Object.keys(collections).map(k => {
        return template.render('manager-subscription-button', { id: k, label: collections[k].name, buttons: buttonsHtml })
        .then(html => {
          return { [collections[k].name]: html }
        })
      }).concat(template.render('manager-subscription-button', { id: '', label: '', buttons: buttonsHtml })
        .then(html => {
          return { '(none)': html }
        })
      )
    ).then(arr => {
      return arr.reduce((p,c) => Object.assign(p,c),{})
    })
  })
  .then(htmls => {
    let query = '#subscription-manager-list tr.subscription-item td:first-of-type .subscription-title-wrap'
    Array.prototype.slice.call(document.querySelectorAll(query))
    .map(node => {
      var channelId = node.closest('tr').dataset.channelExternalId
      var collection = collections[subscriptions[channelId]]
      var elem = document.createElement('div')
      node.appendChild(elem)

      if(collection === undefined) {
        elem.outerHTML = htmls['(none)']
      } else {
        elem.outerHTML = htmls[collection.name]
      }

      node.querySelector('.add-to-collection ul').setAttribute('data-subscription-id',channelId)
    })
  })
  .then(() => {
    window.addEventListener('click',e => {
      if(e.target.matches('ul[data-subscription-id] li button, ul[data-subscription-id] li button *')) {
        var collectionId = e.target.closest('li').dataset.collectionId
        var subscriptionid = e.target.closest('ul').dataset.subscriptionId

        if(collectionId === '') {
          _removeSubscription(subscriptionid)
        }
        else {
          _addSubscription(subscriptionid,collectionId)
        }
      }
    })
  })
})

_getCollections().then(collections => {
  window.addEventListener('message',e => {
    if (event.source != window) {
      return
    }

    var _getAddSubscriptionButton = function(subId) {
      return document.querySelector('#subscription-manager-list\
        tr[data-channel-external-id="'+subId+'"] .add-to-collection')
    }

    var _setButtonCollectionId = function(subId,collectionId) {
      _getAddSubscriptionButton(subId).setAttribute('data-collection-id',collectionId)
      var label = collectionId === '' ? '' : collections[collectionId].name
      _getAddSubscriptionButton(subId).querySelector('.collection-label-wrapper').textContent = label
    }

    if (event.data.type) {
      switch(event.data.type) {
        case 'SUBSCRIPTION_ADDED':
          _setButtonCollectionId(event.data.subscriptionId,event.data.collectionId)
          break;
        case 'SUBSCRIPTION_REMOVED':
          _setButtonCollectionId(event.data.subscriptionId,'')
          break;
        case 'SUBSCRIPTION_UPDATED':
          _setButtonCollectionId(event.data.subscriptionId,event.data.newValue)
          break;
        case 'COLLECTION_ADDED':
          template.render('manager-section-item',{
            id: event.data.id,
            name: event.data.name
          }).then(html => {
            var elem = document.createElement('tr')
            document.querySelector('#collection-manager-list tbody').appendChild(elem)
            elem.outerHTML = html
          })
          break;
        case 'COLLECTION_REMOVED':
          document.getElementById(event.data.id+'-manager-collection').remove()
          break;
      }
    }
  })
})