open Webapi.Dom;
open YT;

type action =
  | SetSubscriptions(array(YT.subscription));

type state = {
  subscriptions: array(YT.subscription)
};

let component = ReasonReact.reducerComponent("YtSubscriptions");

let make = (~render, _children) => {
  ...component,
  initialState: () => {
    subscriptions: [||]
  },
  subscriptions: (self) => [
    Sub(
      () => {
        YT.whenSubscriptionsFullyLoaded |> Js.Promise.then_(guide => {
          let subs = guide |> Element.querySelectorAll("ytd-guide-entry-renderer")
          |> NodeList.toArray
          |> Js.Array.map(sub => {
            let elem = sub
              |> Element.ofNode
              |> Util.unwrapUnsafely
              |> Element.querySelector("a")
              |> Util.unwrapUnsafely
            ;
        
            let label = elem |> Element.getAttribute("title") |> Util.unwrapUnsafely;
            let uri = elem |> Element.getAttribute("href") |> Util.unwrapUnsafely;
            let counter =  elem
              |> Element.querySelector(".guide-entry-count")
              |> (elem) => switch(elem) {
                | None => 0
                | Some(v) => v |> Element.innerHTML |> Js.String.trim |> int_of_string
              }
            ;
            let img = elem
              |> Element.querySelector("yt-icon")
              |> Util.unwrapUnsafely
              |> Element.getAttribute("disable-upgrade")
              |> Util.unwrapUnsafely
              |> Json.parseOrRaise
              |> (json) => {
                json === json;
                [%raw "json.thumbnails[0].url"]
              }
            ;

            let uriRegex = [%bs.re "/channel\\/(.+)/"];
            let channelId = Js.Re.exec(uri, uriRegex) |> (result) => switch (result) {
            | None => uri
            | Some(result) => Js.Nullable.to_opt(Js.Re.captures(result)[1]) |> Util.unwrapUnsafely
            };

            let temp : YT.subscription = {
              label: label,
              channelId: channelId,
              uri: uri,
              thumbnail: img,
              counter: counter
            };
            temp
          });
          self.send(SetSubscriptions(subs));
          Js.Promise.resolve(guide);
        })
        |> ignore;
      },
      () => ()
    )
  ],
  reducer: (action, _state) => switch (action) {
    | SetSubscriptions(subscriptions) => {
      let toStore = [%bs.obj {
        "subscriptions": ref([||])
      }];
      let subList = Array.map(sub => {
        let convertedSub = YT.subscriptionToJs(sub);
        convertedSub === convertedSub;
        let channelId = "subscriptions." ++ sub.channelId;
        channelId === channelId;
        [%raw "toStore[channelId] = convertedSub"];
        sub.channelId;
      }, subscriptions);
      toStore##subscriptions := subList;
      Chrome.Storage.Sync.set(toStore);
      ReasonReact.Update({ subscriptions: subscriptions })
    }
  },
  render: ({state}) => {
    render(state.subscriptions);
  }
};
