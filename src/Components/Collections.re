[@bs.deriving jsConverter]
type collection = {
  label: string,
  counter: int,
  subscriptions: array(string)
};

type action =
  | SetCollections(Js.Dict.t(collection));

type state = {
  collections: Js.Dict.t(collection)
};

let component = ReasonReact.reducerComponent("Collections");

let make = (~render: (Js.Dict.t(collection)) => ReasonReact.reactElement, _children) => {
  ...component,
  initialState: () => {
    collections: Js.Dict.empty()
  },
  subscriptions: (self) => [
    Sub(
      () => {
        Chrome.Storage.Sync.getAll(Js.null, (value) => {
          let collectionsList = value##collections
            |> Js.Undefined.to_opt
            |> (v) => switch (v) {
              | None => [||]
              | Some(v) => v
            }
          ;

          let collections = Js.Dict.empty();
          Array.iter(id => {
            let temp = collectionFromJs([%raw "value['collections.' + id]"]);
            Js.Dict.set(collections, id, temp)
          }, collectionsList);
          self.send(SetCollections(collections));
        });
      },
      () => ()
    )
  ],
  reducer: (action, _state) => switch (action) {
    | SetCollections(collections) => ReasonReact.Update({ collections: collections })
  },
  render: ({state}) => {
    render(state.collections);
  }
};
