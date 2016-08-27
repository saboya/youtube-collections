'use strict'

const storage = {}

storage.get = function (keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, obj => {
      if (chrome.runtime.lastError === undefined) {
        resolve(obj)
      } else {
        reject(chrome.runtime.lastError)
      }
    })
  })
}

storage.set = function (keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(keys, () => {
      if (chrome.runtime.lastError === undefined) {
        resolve(true)
      } else {
        reject(chrome.runtime.lastError)
      }
    })
  })
}

storage.remove = function (keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.remove(keys, () => {
      if (chrome.runtime.lastError === undefined) {
        resolve(true)
      } else {
        reject(chrome.runtime.lastError)
      }
    })
  })
}

storage.clear = function() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.clear(() => {
      if (chrome.runtime.lastError === undefined) {
        resolve(true)
      } else {
        reject(chrome.runtime.lastError)
      }
    })
  })
}
