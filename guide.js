'use strict'

const _guide_element = document.querySelector('#guide')
const __channels = []

// chrome.tabs.insertCSS(integer tabId, object details, function callback)

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
    var _getGuideSection = () => {
      return document.querySelector('#guide-subscriptions-section')
    }

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
  var collections = valueArr[1].collections
  var subscriptions = valueArr[2].subscriptions

  subSection.querySelectorAll('#guide-channels > li.guide-channel').forEach(node => {
    let channelId = node.querySelector('a').getAttribute('data-external-id')
      if(subscriptions[channelId] !== undefined) {
      __channels.push({
        id: channelId,
        count: node.querySelector('span.no-count') ? 0 : parseInt(node.querySelector('.guide-count-value').textContent),
        name: node.querySelector('a.guide-item').getAttribute('title'),
        node: node,
        collection: subscriptions[channelId]
      })
    }
  })

  var toInject = ''

  for (var key in collections) {
    let channels = __channels.filter(channel => channel.collection === key)
    channels.forEach(channel => {
      channel.node.style.display = 'none'
    })
    toInject += _getHtmlForGuideButton(collections[key].name,channels.reduce((a,c) => a + c.count,0))
  }

  document.getElementById('guide-channels').innerHTML = toInject + document.getElementById('guide-channels').innerHTML
})
