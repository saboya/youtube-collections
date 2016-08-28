'use strict'

const __collections = storage.get('collections').then(item => {
  return item.collections
})
const __subscriptions = storage.get('subscriptions').then(item => {
  return item.subscriptions
})