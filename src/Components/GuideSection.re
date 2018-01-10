let component = ReasonReact.statelessComponent("GuideSection");

let make = (~title, children) => {
  ...component,
  render: (_self) => ReasonReact.createDomElement(
    "ytd-guide-section-renderer",
    ~props=Js.Obj.empty(),
    [|
      <h3 className="style-scope ytd-guide-section-renderer">
        {ReasonReact.stringToElement(title)}
      </h3>,
      ReasonReact.createDomElement(
        "div",
        ~props={
          "id": "items",
          "className": "style-scope ytd-guide-section-renderer"
        },
        children
      )
    |]
  )
};
