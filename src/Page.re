let component = ReasonReact.statelessComponent("Page");

/* underscores before names indicate unused variables. We name them for clarity */
let make = (~message, _children) => {
  ...component,
  render: (_self) => <div>
    <button> {ReasonReact.stringToElement("Hello!")} </button>
    <Guide>
      <GuideSection title="Collections" />
    </Guide>
  </div>
};
