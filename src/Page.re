let component = ReasonReact.statelessComponent("Page");

let make = (_children) => {
  ...component,
  render: (_self) => <div>
    <button> {ReasonReact.stringToElement("Hello!")} </button>
    <GuideLoaded render=(() => {
      <Guide>
        <GuideSection title="Collections" />
      </Guide>
    }) />
  </div>
};
