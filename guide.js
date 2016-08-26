'use strict'

const _guide_element = document.querySelector('#guide')
const __colections = storage.get('collections')

// chrome.tabs.insertCSS(integer tabId, object details, function callback)

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
    name: 'good',
    channels: [
      'UCItISwABVRjboRSBBi6WYTA',
      'UCeBMccz-PDZf6OB4aV6a3eA'
    ]
  }

  collections[badId] = {
    name: 'bad',
    channels: [
      'UCrZTN5qnHqGhZglG3wUWKng',
      'UCsQnAt5I56M-qx4OgCoVmeA'
    ]
  }

  storage.set({
    subscriptions: subscriptions,
    collections: collections
  })
}

Promise.all([
  _getSubscriptionsSection(),
  __colections
]).then(valueArr => {
  var subSection = valueArr[0]
  var _collections = valueArr[1]

  subSection.querySelectorAll('#guide-channels > li.guide-channel').forEach(elem => {
    var channel = {
      id: elem.querySelector('a').getAttribute('data-external-id'),
      count: elem.querySelector('span.no-count') ? 0 : parseInt(elem.querySelector('.guide-count-value').textContent),
      name: elem.querySelector('a.guide-item').getAttribute('title')
    }
    elem.querySelector('.display-name > span').textContent = channel.name + collections[subscriptions[channel.id]].name
  })
})
