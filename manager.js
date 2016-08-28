'use strict'

document.querySelectorAll('#subscription-manager-list tr.subscription-item').forEach(element => {
  console.log(element.getAttribute('data-subscription-id'))
})

