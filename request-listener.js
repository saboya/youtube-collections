'use strict'

var scriptContent = "(function(open) { \
  XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {\
    if(url.match(/feed$/)) {\
      this.addEventListener('readystatechange', function() {\
        if(this.readyState == 4) {\
          window.postMessage({ type: 'EVENTS_FROM_PAGE', events: JSON.parse(this.responseText).events }, '*');\
        }\
      }, false);\
    }\
    if(url.match(/future$/)) {\
      this.addEventListener('readystatechange', function() {\
        if(this.readyState == 4) {\
          setTimeout(function(){\
            var bills = angular.element($('bill-browser')[0]).scope().$$childTail.bills;\
            window.postMessage({ type: 'BILLS_READY', bills: bills }, '*');\
          },1000);\
        }\
      }, false);\
    }\
    open.call(this, method, url, async, user, pass);\
  };\
})(XMLHttpRequest.prototype.open);"

var script = document.createElement('script')
script.id = 'tmpScript'
script.appendChild(document.createTextNode(scriptContent))
document.head.appendChild(script)
