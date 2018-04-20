module Item {
  let component = ReasonReact.statelessComponent("YT.Dialog.Item");

  let make = (~checked: bool, children) => {
    ...component,
    render: (_self) => <Util.ClearRef render=((setRef, refCleared) => {
      ReasonReact.createDomElement(
      "ytd-playlist-add-to-option-renderer",
      ~props={
        "ref": setRef,
        "disable-upgrade": "",
        "class": "style-scope ytd-add-to-playlist-renderer"
      },
      !refCleared ? [||] : [|
        <Util.ClearRef render=((setRef, refCleared) => {
          ReasonReact.createDomElement(
            "paper-checkbox",
            ~props={
              "ref": setRef,
              "disable-upgrade": "",
              "id": "checkbox",
              "class": "style-scope ytd-playlist-add-to-option-renderer",
              "role": "checkbox",
              "tabindex": "0",
              "toggles": "",
              "checked": checked,
              "aria-checked": checked,
              "aria-disabled": "false",
              "style": {
                "--paper-checkbox-ink-size": "48px"
              }
            },
            !refCleared ? [||] : [|
            <div id="checkboxContainer" className="style-scope paper-checkbox">
              <div id="checkbox" className={(checked ? "checked " : "") ++ "style-scope paper-checkbox"}>
                <div id="checkmark" className={(checked ? " " : "hidden ") ++ "style-scope paper-checkbox"}></div>
              </div>
            </div>,
            <div id="checkboxLabel" className="style-scope paper-checkbox">
              <div id="checkbox-container" className="style-scope ytd-playlist-add-to-option-renderer">
                <div id="checkbox-label" className="style-scope ytd-playlist-add-to-option-renderer">
                  <Fragment>
                  [|
                    ReasonReact.createDomElement(
                      "yt-formatted-string",
                      ~props={
                        "key": "0",
                        "id": "label",
                        "class": "checkbox-height style-scope ytd-playlist-add-to-option-renderer",
                        "ellipsis-truncate": ""
                      },
                      children
                    ),
                    ReasonReact.createDomElement(
                      "yt-formatted-string",
                      ~props={
                        "key": "1",
                        "id": "byline",
                        "ellipsis-truncate": "",
                        "class": "style-scope ytd-playlist-add-to-option-renderer"
                      },
                      [||]
                    )
                  |]
                  </Fragment>
                </div>
              </div>
            </div>
            |]
          )
        }) />
      |]
    )}) />
  };
};

module Container {
  let component = ReasonReact.statelessComponent("YT.Dropdown.Container");

  let make = (children) => {
    ...component,
    render: (_self) => ReactDOMRe.createPortal(
      <Fragment> ...children </Fragment>,
      Webapi.Dom.document |> Webapi.Dom.Document.querySelector("body") |> Util.unwrapUnsafely
    )
  };
};

type state = {
  hoveredSubId: option(string)
};

type action =
  | SetHoveredSubId(option(string))
;

let component = ReasonReact.reducerComponent("YT.Dropdown");

let make = (~left, ~top, ~open_: bool, children) => {
  ...component,
  initialState: () => {
    hoveredSubId: None
  },
  subscriptions: (self) => [
    Sub(
      () => {
        let callback = (e)=> {            
          let uri = Webapi.Dom.MouseEvent.target(e)
          |> Webapi.Dom.EventTarget.unsafeAsElement
          |> Webapi.Dom.Element.closest("a")
          |> Webapi.Dom.Element.getAttribute("href")
          |> Util.unwrapUnsafely;

          let uriRegex = [%bs.re "/channel\\/(.+)/"];
          let channelId = Js.Re.exec(uri, uriRegex) |> (result) => switch (result) {
          | None => uri
          | Some(result) => Js.Nullable.to_opt(Js.Re.captures(result)[1]) |> Util.unwrapUnsafely
          };

          self.send(SetHoveredSubId(Some(channelId)));
        };

        YT.whenSubscriptionsFullyLoaded |> Js.Promise.then_(guide => {
          guide
            |> Webapi.Dom.Element.querySelector("#items")
            |> Util.unwrapUnsafely
            |> Webapi.Dom.Element.addMouseOverEventListener(callback);
          Js.Promise.resolve(guide);
        }) |> ignore;

        callback;
      },
      (callback) => {
        YT.whenSubscriptionsFullyLoaded |> Js.Promise.then_(guide => {
          guide |> Webapi.Dom.Element.removeMouseOverEventListener(callback);
          Js.Promise.resolve(guide);
        }) |> ignore;
      }
    ),
    Sub(
      () => {
        let callback = (e)=> {
          self.send(SetHoveredSubId(None));
        };

        YT.whenSubscriptionsFullyLoaded |> Js.Promise.then_(guide => {
          guide
            |> Webapi.Dom.Element.querySelector("#items")
            |> Util.unwrapUnsafely
            |> Webapi.Dom.Element.addEventListener("mouseleave", callback);
          Js.Promise.resolve(guide);
        }) |> ignore;

        callback;
      },
      (callback) => {
        YT.whenSubscriptionsFullyLoaded |> Js.Promise.then_(guide => {
          guide |> Webapi.Dom.Element.removeEventListener("mouseleave", callback);
          Js.Promise.resolve(guide);
        }) |> ignore;
      }
    )
  ],
  reducer: (action, state) => {
    switch (action) {
    | SetHoveredSubId(v) => ReasonReact.Update({ hoveredSubId: v })
    };
  },
  render: ({ state }) => <Container>
    <Util.ClearRef render=((setRef, refCleared) => {
      Js.log(state.hoveredSubId);
      ReasonReact.createDomElement(
        "iron-dropdown",
        ~props={
          "aria-disabled": "false",
          "horizontal-align": "left",
          "vertical-align": "top",
          "class": "style-scope ytd-popup-container",
          "style": ReactDOMRe.Style.make(
            ~display=(open_ ? "block" : "none"),
            ~outline="none",
            ~position="fixed",
            ~zIndex="2202",
            ~left=left,
            ~top=top,
            ()
          )
        },
        [|
          <div id="contentWrapper" className="style-scope iron-dropdown">
            {ReasonReact.createDomElement(
              "ytd-add-to-playlist-renderer",
              ~props={
                "ref": setRef,
                "tabindex": "0",
                "disable-upgrade": "",
                "class": "dropdown-content style-scope ytd-popup-container",
                "style": ReactDOMRe.Style.make(
                  ~outline="none",
                  ~boxSizing="border-box",
                  ~maxWidth="300px",
                  ~maxHeight="300px",
                  ()
                )
              },
              !refCleared ? [||] : [|
                <div
                key="0"
                  id="header"
                  className="style-scope ytd-add-to-playlist-renderer"
                >
                    {ReasonReact.stringToElement("Add to collection")}
                </div>,
                {ReasonReact.createDomElement(
                  "div",
                  ~props={
                    "key": "1",
                    "id": "playlists",
                    "className": "style-scope ytd-add-to-playlist-renderer scrollable"
                  },
                  children
                )}
              |]
            )}
          </div>
        |]
      )
      })
    />
  </Container>
};
