module SectionTitle = {
  let component = ReasonReact.statelessComponent("YT.Guide.SectionTitle");

  let make = (children) => {
    ...component,
    render: (_self) => <h3 className="style-scope ytd-guide-section-renderer">
      {ReasonReact.createDomElement(
        "yt-formatted-string",
        ~props={
          "id": "guide-section-title",
          "class": "style-scope ytd-guide-section-renderer"
        },
        children
      )}
    </h3>
  };    
};

module SectionItems = {
  let component = ReasonReact.statelessComponent("YT.Guide.SectionItems");

  let make = (children) => {
    ...component,
    render: (_self) => ReasonReact.createDomElement(
      "div",
      ~props={
        "id": "items",
        "className": "style-scope ytd-guide-section-renderer"
      },
      children
    )
  }
};

module SectionItemIcon = {
  type state = {
    refCleared: bool,
    imgRef: ref(option(ReasonReact.reactRef))
  };
  
  type action =
    | ClearRef(bool)
  ;
  
  let setGuideRef = (theRef, {ReasonReact.state, ReasonReact.send}) => {
    if (!state.refCleared) {
      state.imgRef := Js.Nullable.to_opt(theRef);
      send(ClearRef(true))
    }
  };
  
  let component = ReasonReact.reducerComponent("YT.Guide.SectionItemIcon");

  let make = (~round = true, children) => {
    ...component,
    initialState: () => ({
      refCleared: false,
      imgRef: ref(None),
    }),
    reducer: (action, state) => {
      switch(action) {
        | ClearRef(refCleared) => {
          Webapi.Dom.Element.setInnerHTML(
            ReactDOMRe.findDOMNode(state.imgRef^ |> Util.unwrapUnsafely),
          "");
          ReasonReact.Update({...state, refCleared: refCleared });
        }
      }
    },
    render: ({ handle, state }) => ReasonReact.createDomElement(
      "yt-img-shadow",
      ~props={
        "height": 24,
        "width": 24,
        "class": "style-scope ytd-guide-entry-renderer no-transition",
        "disable-upgrade": "",
        "style": {ReactDOMRe.Style.make(~borderRadius=(round ? "50" : "0"), ())},
        "ref": handle(setGuideRef)
      },
      {state.refCleared ? children : [||]}
    )
  };
};

module SectionItem = {
  type state = {
    refCleared: bool,
    guideRef: ref(option(ReasonReact.reactRef))
  };
  
  type action =
    | ClearRef(bool)
  ;
  
  let setGuideRef = (theRef, {ReasonReact.state, ReasonReact.send}) => {
    if (!state.refCleared) {
      state.guideRef := Js.Nullable.to_opt(theRef);
      send(ClearRef(true))
    }
  };
  
  let component = ReasonReact.reducerComponent("YT.Guide.SectionItem");
  
  let make = (~label, ~image ="", ~uri = "", ~counter = 0, _children) => {
    ...component,
    initialState: () => ({
      refCleared: false,
      guideRef: ref(None),
    }),
    reducer: (action, state) => {
      switch(action) {
        | ClearRef(refCleared) => {
          Webapi.Dom.Element.setInnerHTML(
            ReactDOMRe.findDOMNode(state.guideRef^ |> Util.unwrapUnsafely),
          "");
          ReasonReact.Update({...state, refCleared: refCleared });
        }
      }
    },
    render: ({state, handle}) => ReasonReact.createDomElement(
      "ytd-guide-entry-renderer",
      ~props={
        "role": "option",
        "tabindex": 0,
        "aria-disabled": false,
        "class": "style-scope ytd-guide-section-renderer",
        "disable-upgrade": "a",
        "ref": handle(setGuideRef)
      },
      {state.refCleared ? [|
        ReasonReact.createDomElement(
          "a",
          ~props={
            "id": "endpoint",
            "className": "yt-simple-endpoint style-scope ytd-guide-entry-renderer",
            "href": uri
          },
          [|
            <SectionItemIcon round={true}>
              <img id="img" className="style-scope yt-img-shadow" src={image} /> 
            </SectionItemIcon>,
            <span
              className="title style-scope ytd-guide-entry-renderer"
            >
              {ReasonReact.stringToElement(label)}
            </span>,
            <span className="guide-entry-count style-scope ytd-guide-entry-renderer">
              {ReasonReact.stringToElement(counter > 0 ? string_of_int(counter) : "")}
            </span>
          |]
        )
      |] : [||]}
    )
  };
};