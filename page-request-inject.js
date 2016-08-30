'use strict'

;(function(config){
window.addEventListener('message', event => {
  if (event.source != window) {
    return
  }

  if(event.data.type == 'PAGE_REQUEST') {
    var response = null

    switch(event.data.request) {
      case 'SET_CONFIG':
        Object.assign(config,event.data.data)
        response = true
        break
      case 'GET_TOKEN_ID':
        response = yt.config_.ID_TOKEN
        break
    }

    window.postMessage({
      type: 'PAGE_RESPONSE',
      request: event.data.request,
      eventId: event.data.eventId,
      response: response
    }, '*')
  }
})

window.postMessage({ type: 'PAGE_READY' },'*')
})({})
