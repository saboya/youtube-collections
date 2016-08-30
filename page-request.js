'use strict'

const _appendScript = new Promise((resolve,reject) => {
  var s = document.createElement('script')
  s.src = chrome.extension.getURL('page-request-inject.js')
  document.head.appendChild(s)

  var resolver = function(event) {
    if (event.source != window) {
      return
    }

    if(event.data.type == 'PAGE_READY') {
      resolve(true)
      window.removeEventListener('message',this)
    }
  }

  window.addEventListener('message', resolver) 
})

function _pageRequest(type,data={}) {
  return _appendScript.then(() =>{
    return new Promise((resolve,reject) => {
      var eventId = HashID.generate()
      var resolver = function(e) {
        if (e.source != window) {
          return
        }

        if(e.data.type == 'PAGE_RESPONSE' && e.data.request == type && e.data.eventId == eventId) {
          if(e.data.err) {
            reject(e.data.err)
          }

          resolve(e.data.response)
          window.removeEventListener('message',this)
        }
      }

      window.postMessage({ type: 'PAGE_REQUEST', request: type, eventId: eventId, data: data }, '*')
      window.addEventListener('message', resolver)
    })
  })
}
