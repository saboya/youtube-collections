open Webapi.Dom;

[%%raw {|
  /*__TYPE__: "content"*/
  /*__MATCHES__: ["https://www.youtube.com/*"]*/
  /*__RUN_AT__: "document_end"*/
|}];

let scriptContent = {|(function(open) {
  XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
    this.addEventListener('readystatechange', function() {
      if(this.readyState == 4) {
        console.log(url);
        console.log(this.responseText);
        window.postMessage({
          type: 'REQUEST_RESPONSE',
          method: method,
          url: url,
          response: this.responseText,
          async: async
        }, "*");
      }
    });
		open.call(this, method, url, async, user, pass);
	};
})(XMLHttpRequest.prototype.open);|};

Util.injectScript(scriptContent);
