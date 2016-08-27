'use strict'

const template = {}

template.load = function (name) {
  return new Promise((resolve,reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', chrome.extension.getURL('templates/'+name+'.html'), true)
    xhr.onreadystatechange = () => { 
      if(xhr.readyState == XMLHttpRequest.DONE) {
        if(xhr.status == 200) {
          resolve(xhr.responseText)
        } else {
        	reject(xhr.status)
        }
      }
    }
    xhr.send()
  })
}

template.render = function(name,vars) {
  return template.load(name).then(template => {
    for(let key in vars) {
      template = template.replace(new RegExp('##'+key+'##', 'g'),vars[key])
    }

    return template
  })
}
