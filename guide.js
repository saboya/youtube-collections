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
  })
})
