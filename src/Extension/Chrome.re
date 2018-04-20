/* https://github.com/reasonml/reason-tools/blob/master/src/extension/common/chrome.re */

/* https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script */

module BrowserAction = {
  [@bs.val] external setIcon : Js.t({..}) => unit = "chrome.browserAction.setIcon";
};

module Extension = {
  [@bs.val] external getURL : string => string = "chrome.extension.getURL";
};

module Runtime = {
  [@bs.val] external id : string = "chrome.runtime.id";
  [@bs.val] external sendMessage : ('a, 'b) => unit = "chrome.runtime.sendMessage";
  [@bs.val]
  external addMessageListener : (('a, Js.t({..}), 'b => unit) => unit) => unit =
    "chrome.runtime.onMessage.addListener";
};

type storageKey = 
| Js_null
| String;

module Storage = {
  module Local = {
    [@bs.val] external get : (Js.Nullable.t(string), Js.t({..}) => unit) => unit = "chrome.storage.local.get";
    [@bs.val] external set : Js.t({..}) => unit = "chrome.storage.local.set";
  };

  module Sync = {
    [@bs.val] external getAll : (Js.null({..}), 'a => unit) => unit = "chrome.storage.sync.get";
    [@bs.val] external clear : (unit => unit) => unit = "chrome.storage.sync.clear";
    [@bs.val] external get : (Js.Nullable.t(string), 'a => unit) => unit = "chrome.storage.sync.get";
    [@bs.val] external set : Js.t({..}) => unit = "chrome.storage.sync.set";
  };

  [@bs.val]
  external addChangeListener :
    (
      (
        Js.Dict.t(
          {
            .
            "newValue": 'a,
            "oldValue": 'a
          }
        ),
        string
      ) =>
      unit
    ) =>
    unit =
    "chrome.storage.onChanged.addListener";
};

module Commands = {
  [@bs.val]
  external addListener : (string => unit) => unit = "chrome.commands.onCommand.addListener";
};

module Tabs = {
  type tabId;
  /*
   type tab = Js.t {.
     id: tabId
   };
   */
  [@bs.val] external create : {. "url": string} => unit = "chrome.tabs.create";
  [@bs.val] external update : (int, Js.t({..})) => unit = "chrome.tabs.update";
  /* TODO: Need MaybeArray to work because Chrome will return an array, but FF supposedly does not */
  /*external executeScript : Js.t {. code: string } => (MaybeArray.t (Js.t {..}) => unit) => unit = "chrome.tabs.executeScript" [@@bs.val];*/
  [@bs.val]
  external executeScript : ({. "code": string}, Js.null_undefined(array(string)) => unit) => unit =
    "chrome.tabs.executeScript";
  [@bs.val]
  external executeScriptFile : ({. "file": string}, unit => unit) => unit =
    "chrome.tabs.executeScript";
  /* TODO: could use bs.ginore here? */
  [@bs.val] external sendMessage : (tabId, 'a, 'b) => unit = "chrome.tabs.sendMessage";
  [@bs.val]
  external query :
    (
      Js.t({..}),
      array(
        {
          .
          "url": string,
          "id": int
        }
      ) =>
      unit
    ) =>
    unit =
    "chrome.tabs.query";
};

module ContextMenus = {
  type id;
  /*
   type config = Js.t {.
     title: string,
     context: array string,
     onclick: (unit => Tabs.tab => unit)
   };
   */
  [@bs.val] external create : /*config*/ Js.t({..}) => id = "chrome.contextMenus.create";
  [@bs.val] external update : (id, /*config*/ Js.t({..})) => unit = "chrome.contextMenus.update";
};
