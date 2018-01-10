let component = ReasonReact.statelessComponent("Guide");

[@bs.val] [@bs.module "react-dom"]
external createPortal : (ReasonReact.reactElement, Dom.element) => ReasonReact.reactElement =
  "createPortal";

[@bs.val] [@bs.return nullable] external _getElementById : string => option(Dom.element) =
  "document.getElementById";

let make = (children) => {
  ...component,
  render: (_self) => switch (_getElementById("guide-renderer")) {
    | None => raise(
        Invalid_argument(
          "Could not find guide-renderer element."
        )
      )
    | Some(element) => createPortal(
      ReasonReact.createDomElement("div", ~props=Js.Obj.empty(), children),
      element
    )
  }
};
