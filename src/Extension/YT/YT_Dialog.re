open Webapi.Dom;

/* https://github.com/reasonml/reason-react/blob/master/docs/react-ref.md */
module Backdrop = {
  let component = ReasonReact.statelessComponent("YT.Dialog.Backdrop");

  let make = (children) => {
    ...component,
    render: (_self) => ReasonReact.createDomElement(
      "iron-overlay-backdrop",
      ~props={
        "class": "opened",
        "opened": "",
        "style": {
          "zIndex": "2201"
        }
      },
      children
    )
  };
};

let component = ReasonReact.statelessComponent("YT.Dialog");

let make = (~open_, children) => {
  ...component,
  render: (_self) => <Fragment>
    {ReasonReact.createDomElement(
      "paper-dialog",
      ~props={
        "role": "dialog",
        "class": "style-scope ytd-popup-container",
        "style": {
          "display": (open_ ? "block" : "none")
        }
      },
      children
    )}
    {open_ ? ReactDOMRe.createPortal(
      <Backdrop />,
      document |> Document.querySelector("body") |> Util.unwrapUnsafely
    ) : ReasonReact.nullElement}
  </Fragment>
};
