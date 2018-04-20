open Webapi.Dom;
open YT;

type action =
  | SubscriptionsGuideLoaded(Dom.element)
;

type state = {
  guideLoaded: bool,
  collectionSectionElement: Dom.element
};

let component = ReasonReact.reducerComponent("GuideLoaded");

let make = (~render, _children) => {
  ...component,
  initialState: () => ({
    guideLoaded: false,
    collectionSectionElement: YT.newGuideSectionElement()
  }),
  subscriptions: (self) => [
    Sub(
      () => {
        YT.whenSubscriptionsGuideLoaded
        |> Js.Promise.then_((element) => {
          self.send(SubscriptionsGuideLoaded(element));
          Js.Promise.resolve();
        })
        |> ignore;
      },
      () => ()
    )
  ],
  reducer: (action, state) => {
  switch(action) {
    | SubscriptionsGuideLoaded(subscriptionSectionElement) => {
      subscriptionSectionElement
      |> Element.closest("#sections")
      |> Element.insertBefore(state.collectionSectionElement, subscriptionSectionElement)
      |> ignore;

      ReasonReact.Update({...state, guideLoaded: true });
    }
  }},
  render: ({state}) => {
    switch (state.guideLoaded) {
    | false => ReasonReact.nullElement
    | true => render(state.collectionSectionElement)
    }
  }
};
