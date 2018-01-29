[@bs.val] [@bs.module "react-dom"]
external createPortal : (ReasonReact.reactElement, Dom.element) => ReasonReact.reactElement =
  "createPortal";

let unwrapUnsafely = fun
  | Some(v) => v
  | None => raise(Invalid_argument("Passed `None` to unwrapUnsafely"));

type action =
  | SetGuideElement(option(Dom.element));

type state = {
  guideElement: option(Dom.element)
};

let component = ReasonReact.statelessComponent("Guide");

open Webapi.Dom;

let make = (children) => {
  ...component,
  render: _self => createPortal(
    /* <Fragment>children</Fragment>, */
    <YtSubscriptions render=(_subscriptions => {
      <Fragment>{children}</Fragment>
    }) />,
    document |> Document.getElementById("guide-renderer") |> unwrapUnsafely
  )
};
