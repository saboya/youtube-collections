/* https://github.com/reasonml/reason-react/issues/162 */
[@bs.module "react"] external reactClass : ReasonReact.reactClass = "Fragment";

let make = children =>
  ReasonReact.wrapJsForReason(~reactClass, ~props=Js.Obj.empty(), children);
