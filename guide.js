'use strict'

const _guide_element = document.querySelector('#guide')

// chrome.tabs.insertCSS(integer tabId, object details, function callback)

function _getGuideSection() {
  return document.querySelector('#guide-subscriptions-section')
}

function _getHtmlForGuideButton (title,count) {
  return '<li class="guide-channel collection-item guide-notification-item overflowable-list-item" role="menuitem">\
  <a class="guide-item yt-uix-sessionlink yt-valign spf-link" href="#" title="'+title+'">\
    <span class="yt-valign-container">\
      <span class="thumb">\
        <span class="video-thumb  yt-thumb yt-thumb-20">\
          <span class="yt-thumb-square">\
            <span class="yt-thumb-clip">\
                <span class="vertical-align"></span>\
            </span>\
          </span>\
        </span>\
      </span>\
      <span class="display-name ">\
        <span>'+title+'</span>\
      </span>\
    </span>\
    <span class="guide-count yt-uix-tooltip yt-valign">\
      <span class="yt-valign-container guide-count-value">'+count+'</span>\
    </span>\
  </a>\
</li>'
}

function _getSubscriptionsSection () {
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
            }else {
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

function _initTestDb () {
  var goodId = HashID.generate()
  var badId = HashID.generate()

  var subscriptions = {
    'UCItISwABVRjboRSBBi6WYTA': goodId,
    'UCeBMccz-PDZf6OB4aV6a3eA': goodId,
    'UCrZTN5qnHqGhZglG3wUWKng': badId,
    'UCsQnAt5I56M-qx4OgCoVmeA': badId
  }

  var collections = {}

  collections[goodId] = {
    name: 'good'
  }

  collections[badId] = {
    name: 'bad'
  }

  storage.set({
    'subscriptions': subscriptions,
    'collections': collections
  })

  console.log('test db initialized')
}

Promise.all([
  _getSubscriptionsSection(),
  __collections,
  __subscriptions
]).then(valueArr => {
  var subSection = valueArr[0]
  var collections = valueArr[1]
  var subscriptions = valueArr[2]
  var channels = []

  subSection.querySelectorAll('#guide-channels > li.guide-channel').forEach(node => {
    let channelId = node.querySelector('a').getAttribute('data-external-id')
      if(subscriptions[channelId] !== undefined) {
      channels.push({
        id: channelId,
        count: node.querySelector('span.no-count') ? 0 : parseInt(node.querySelector('.guide-count-value').textContent),
        name: node.querySelector('a.guide-item').getAttribute('title'),
        node: node,
        collection: subscriptions[channelId]
      })
    }
  })

  template.render('guide-section',{title:'Collections'}).then(html => {
    var node = document.createElement('li')
    _getGuideSection().parentNode.insertBefore(node,_getGuideSection())
    node.outerHTML = html
    return document.querySelector('#guide-collection-list .guide-channels-list')
  }).then(node => {
    return Object.keys(collections).map(id => {
      return template.render('guide-section-item',{
        name: collections[id].name,
        count: channels.filter(channel => channel.collection === id).reduce((a,c) => a + c.count,0)
      }).then(html => {
        var elem = document.createElement('li')
        node.appendChild(elem)
        elem.outerHTML = html
      })
    })
  })
})
