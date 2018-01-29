open Webapi.Dom;

let unwrapUnsafely = fun
  | Some(v) => v
  | None => raise(Invalid_argument("Passed `None` to unwrapUnsafely"));

type state = 
  | Loading
  | Loaded
  | Error;

let component = ReasonReact.reducerComponent("GuideLoaded");

let make = (~render, _children) => {
  ...component,
  initialState: () => {
    let temp = Document.querySelectorAll("#guide-renderer > #sections > ytd-guide-section-renderer > h3 > #guide-section-title > a", document)
    |> NodeList.toArray
    |> Js.Array.find(node => (node
      |> Element.ofNode
      |> unwrapUnsafely
      |> Element.innerHTML
    ) === "Subscriptions");

    switch (temp) {
      | None => Loading
      | Some(_node) => Loaded
    }
  },
  subscriptions: (self) => [
    Sub(
      () => {
        let guideElement = document
        |> Document.getElementById("guide-inner-content")
        |> unwrapUnsafely;
        let observer = MutationObserver.make((records, _observer) => {
          records
          |> Array.map((record) => {
            if (MutationRecord.type_(record) === "childList" && (MutationRecord.target(record) |> Element.ofNode |> unwrapUnsafely) === guideElement) {
              self.send(Loaded);
            }
          })
          |> ignore
        });

        switch (self.state) {
        | Loading => observer |> MutationObserver.observe(guideElement, {
            "childList": true,
            "subtree": true,
            "attributes": true,
            "characterData": true
          });
        | Loaded => ()
        | Error => ()
        };
 
        observer
      },
      (observer) => {
        observer |> MutationObserver.disconnect;
        observer |> MutationObserver.takeRecords |> ignore;
        ()
      }
    )
  ],
  reducer: (action, _state) => ReasonReact.Update(action),
  render: ({state}) => {
    switch (state) {
    | Loading => ReasonReact.nullElement
    | Loaded => render()
    | Error => render()
    }
  }
};
