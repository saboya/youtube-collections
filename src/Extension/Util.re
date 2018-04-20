let unwrapUnsafely = fun
  | Some(v) => v
  | None => raise(Invalid_argument("Passed `None` to unwrapUnsafely"));

let hashCode : string => int = (string) => {
  let hash = ref(0);

  for (i in 0 to Js.String.length(string)) {
    let chr = int_of_float(Js.String.charCodeAt(i, string));

    hash := ((hash^ lsl 5) - hash^) - chr;
  };
  hash^;
};

let injectScript = (string) => {
  let script = Webapi.Dom.document |> Webapi.Dom.Document.createElement("script");
  Webapi.Dom.Element.setTextContent(script, string);

  Webapi.Dom.document
  |> Webapi.Dom.Document.asHtmlDocument
  |> unwrapUnsafely
  |> Webapi.Dom.HtmlDocument.documentElement
  |> Webapi.Dom.Element.appendChild(script);
};

let injectReady = Js.Promise.make((~resolve, ~reject) => {
  let script = "(() => window['" ++ Chrome.Runtime.id ++ {|'] = (id, data) => {
    window.postMessage({
      type: 'YTC_MSG',
      id: id,
      data: data
    }, "*");
  })() |};
  injectScript(script);

  [@bs] resolve("window['" ++ Chrome.Runtime.id ++ "']");
});

let runScript = (func) => Js.Promise.make((~resolve, ~reject) => {
  injectReady |> Js.Promise.then_((injectedFuncName) => {
    let funcString = Js.String.make(func);
    let funcId = hashCode(funcString ++ (Js.Date.make() |> Js.Date.toString));

    injectScript({j| $(injectedFuncName)($(funcId), $(funcString)()) |j});

    let callback : Dom.event => unit = (e) => {
      e === e;
      let self : Dom.event => unit = [%raw "this"];
      let type_ : string = [%raw "e.data.type"];
      let source : Dom.eventTarget = [%raw "e.source"];
      let data = [%raw "e.data"];

      if (
        source === (Webapi.Dom.window |> Webapi.Dom.Window.asEventTarget)
        && type_ === "YTC_MSG"
        && data##id === funcId
        ) {
          [@bs] resolve(data##data);
          Webapi.Dom.window |> Webapi.Dom.Window.removeEventListener("message", self);
      };
    };

    Webapi.Dom.window |> Webapi.Dom.Window.addEventListener("message", callback);
    Js.Promise.resolve(injectedFuncName);
  }) |> ignore;
});

module ClearRef{
  type state = {
    refCleared: bool,
    theRef: ref(option(ReasonReact.reactRef))
  };
  
  type action =
    | ClearRef(bool)
  ;
  
  let setRef = (theRef, {ReasonReact.state, ReasonReact.send}) => {
    if (!state.refCleared) {
      state.theRef := Js.Nullable.to_opt(theRef);
      send(ClearRef(true))
    }
  };
  
  let component = ReasonReact.reducerComponent("ClearRef");
  
  let make = (~render: ('a, bool) => ReasonReact.reactElement, _children) => {
    ...component,
    initialState: () => ({
      refCleared: false,
      theRef: ref(None),
    }),
    reducer: (action, state) => {
      switch(action) {
        | ClearRef(refCleared) => {
          Webapi.Dom.Element.setInnerHTML(
            ReactDOMRe.findDOMNode(state.theRef^ |> unwrapUnsafely),
          "");
          ReasonReact.Update({...state, refCleared: refCleared });
        }
      }
    },
    render: ({state, handle}) => render(handle(setRef), state.refCleared)
  };  
};
