open Webapi.Dom;

let unwrapUnsafely = fun
  | Some(v) => v
  | None => raise(Invalid_argument("Passed `None` to unwrapUnsafely"));

type subscription = {
  name: string,
  count: int
};

type action =
  | SetSubscriptions(array(subscription));

type state = {
  subscriptions: array(subscription)
};

let component = ReasonReact.reducerComponent("YtSubscriptions");

let make = (~render, _children) => {
  ...component,
  initialState: () => {
    subscriptions: [||]
  },
  didMount: (_self) => {
    Document.querySelectorAll("#guide-renderer > #sections > ytd-guide-section-renderer > h3 > #guide-section-title > a", document)
    |> NodeList.toArray
    |> Js.Array.find(node => (node
      |> Element.ofNode
      |> unwrapUnsafely
      |> Element.innerHTML
    ) === "Subscriptions")
    |> ignore;
    ReasonReact.NoUpdate
  },
  reducer: (action, _state) => switch (action) {
    | SetSubscriptions(subscriptions) => ReasonReact.Update({ subscriptions: subscriptions })
  },
  render: ({state}) => {
    render(state.subscriptions);
  }
};
