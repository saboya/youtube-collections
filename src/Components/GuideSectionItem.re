let component = ReasonReact.statelessComponent("GuideSectionItem");

let make = (~label, ~counter, _children) => {
  ...component,
  render: (_self) => ReasonReact.createDomElement(
    "ytd-guide-entry-renderer",
    ~props={
      "role": "option",
      "tabindex": 0,
      "aria-disabled": false,
      "className": "style-scope ytd-guide-section-renderer"
    },
    [|
      ReasonReact.createDomElement(
        "a",
        ~props={
          "id": "endpoint",
          "className": "yt-simple-endpoint style-scope ytd-guide-entry-renderer"
        },
        [|
          ReasonReact.createDomElement(
            "yt-img-shadow",
            ~props={
              "height": 24,
              "width": 24,
              "className": "style-scope ytd-guide-entry-renderer no-transition",
              "style": {"backgroundColor": "transparent"}
            },
            [|<img id="img" className="style-scope yt-img-shadow" src="" />|]
          ),
          <span className="title style-scope ytd-guide-entry-renderer">
            {ReasonReact.stringToElement(label)}
          </span>,
          <span className="guide-entry-count style-scope ytd-guide-entry-renderer">
            {ReasonReact.stringToElement(counter)}
          </span>
        |]
      )
    |]
  )
};
