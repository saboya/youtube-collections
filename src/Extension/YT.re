open Webapi.Dom;

[@bs.deriving jsConverter]
type subscription = {
  label: string,
  channelId: string,
  uri: string,
  thumbnail: string,
  counter: int,
};
let getIdToken = () => Util.runScript(() => {
  [%raw {| yt.config_.ID_TOKEN |}];
});

let isDarkTheme = () => {
  switch(document
  |> Document.documentElement
  |> Element.getAttribute("dark")
  ) {
  | None => false
  | Some(_v) => true
  }
};

let sectionElement = () => document
|> Document.getElementById("sections")
|> Util.unwrapUnsafely;

let findSubscriptions = () => Document.querySelectorAll("
  #guide-renderer > #sections > ytd-guide-section-renderer
    > h3 > #guide-section-title > a"
, document)
|> NodeList.toArray
|> Js.Array.find(node => (node
  |> Element.ofNode
  |> Util.unwrapUnsafely
  |> Element.innerHTML
) === "Subscriptions");

let subscriptionsGuide = () => findSubscriptions()
|> Util.unwrapUnsafely
|> Element.ofNode
|> Util.unwrapUnsafely
|> Element.closest("ytd-guide-section-renderer");

let elemReady = (check:unit => option(Dom.element), observe) => Js.Promise.make((~resolve, ~reject) => {
  let loaded = () => check()
  |> (node) => switch(node) {
  | None => false
  | Some(_v) => true
  };

  if (loaded()) {
    [@bs] resolve(check() |> Util.unwrapUnsafely);
  } else {
    MutationObserver.make((records, observer) => {
      records
      |> Array.map((record) => {
        if(loaded()) {
          observer |> MutationObserver.disconnect;
          observer |> MutationObserver.takeRecords |> ignore;
          [@bs] resolve(check() |> Util.unwrapUnsafely)
        }
      })
      |> ignore
    })
    |> MutationObserver.observe(observe, {
      "childList": true
    })
    |> ignore;
  }
});

let whenYtdAppReady = elemReady(
  () => document |> Document.querySelector("ytd-app"),
  document |> Document.querySelector("body") |> Util.unwrapUnsafely
);

let whenGuideRendererReady = whenYtdAppReady
|> Js.Promise.then_((_) => elemReady(
  () => document |> Document.querySelector("#guide-inner-content > ytd-guide-renderer"),
  document |> Document.getElementById("guide-inner-content") |> Util.unwrapUnsafely
));

let whenSubscriptionsGuideLoaded = whenGuideRendererReady |> Js.Promise.then_((_) => {
  Js.Promise.make((~resolve, ~reject) => {
    let subscriptionsGuideLoaded = () => findSubscriptions()
    |> (node) => switch (node) {
      | None => false
      | Some(_v) => true
    };

    if (subscriptionsGuideLoaded()) {
      [@bs] resolve(subscriptionsGuide());
    } else {
      MutationObserver.make((records, observer) => {
        records
        |> Array.map((_record) => {
          if (subscriptionsGuideLoaded()) {
            observer |> MutationObserver.disconnect;
            observer |> MutationObserver.takeRecords |> ignore;
            [@bs] resolve(subscriptionsGuide())
          }
        })
        |> ignore
      })
      |> MutationObserver.observe(sectionElement(), {
        "childList": true
      });
    }
  })
});

let whenSubscriptionsFullyLoaded = Js.Promise.make((~resolve, ~reject) => {
  whenSubscriptionsGuideLoaded |> Js.Promise.then_((subscriptionsGuide) => {
    let subscriptionsFullyLoaded = () => subscriptionsGuide |> Element.getAttribute("can-show-more")
    |> (attr) => switch (attr) {
      | None => true
      | Some(_v) => false
    };

    if (subscriptionsFullyLoaded()) {
      [@bs] resolve(subscriptionsGuide);
    } else {
      MutationObserver.make((records, observer) => {
        records
        |> Array.map((_record) => {
          if (subscriptionsFullyLoaded()) {
            observer |> MutationObserver.disconnect;
            observer |> MutationObserver.takeRecords |> ignore;
            [@bs] resolve(subscriptionsGuide)
          }
        })
        |> ignore
      })
      |> MutationObserver.observe(subscriptionsGuide, {
        "attributes": true
      });
    };
    Js.Promise.resolve(subscriptionsGuide);
  }) |> ignore;
});

let newGuideSectionElement = () => {
  let elem = document |> Document.createElement("ytd-guide-section-renderer");
  Element.setInnerHTML(elem, "");
  elem |> Element.setAttribute("class","style-scope ytd-guide-renderer");
  elem
};

module Dialog = YT_Dialog;
module Guide = YT_Guide;
