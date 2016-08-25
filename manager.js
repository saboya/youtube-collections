'use strict'

document.querySelectorAll('#subscription-manager-list tr.subscription-item').forEach(element => {
  console.log(element.getAttribute('data-subscription-id'))
})

// https://www.youtube.com/watch_fragments_ajax?v=OI3HMcLMwn4&tr=time&frags=guide&spf=load
