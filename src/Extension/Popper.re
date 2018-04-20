[@bs.module "react-popper/lib/Manager.js"] external managerclass : ReasonReact.reactClass = "default";
[@bs.module "react-popper/lib/Target.js"] external targetClass : ReasonReact.reactClass = "default";
[@bs.module "react-popper/lib/Popper.js"] external popperClass : ReasonReact.reactClass = "default";
[@bs.module "react-popper/lib/Arrow.js"] external arrowClass : ReasonReact.reactClass = "default";

type renderProps = {
  targetProps: string,
  restProps: string
};

type placement =
  | Auto
  | Top
  | Right
  | Bottom
  | Left
;

module Manager {
  let make = (children) => {
    ReasonReact.wrapJsForReason(
      ~reactClass=managerclass,
      ~props=Js.Obj.empty(),
      children
    );
  };
};

module Target {
  let make = (children) => {
    ReasonReact.wrapJsForReason(
      ~reactClass=targetClass,
      ~props=Js.Obj.empty(),
      children
    );
  };
};

module Popper {
  let make = (
    ~placement: placement,
    ~eventsEnabled: bool = true,
    children
  ) => {
    ReasonReact.wrapJsForReason(
      ~reactClass=popperClass,
      ~props={
        "placement": switch(placement) {
        | Auto => "auto"
        | Top => "top"
        | Right => "right"
        | Bottom => "bottom"
        | Left => "left"
        },
        "eventsEnabled": Js.Boolean.to_js_boolean(eventsEnabled)
      },
      children
    );
  };
};

module Arrow {
  let make = (
    children
  ) => {
    ReasonReact.wrapJsForReason(
      ~reactClass=arrowClass,
      ~props=Js.Obj.empty(),
      children
    );
  };
};
