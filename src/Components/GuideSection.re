let component = ReasonReact.statelessComponent("GuideSection");

let make = (~guideSectionElement, children) => {
  ...component,
  render: (_self) => ReactDOMRe.createPortal(
    <Fragment> ...children </Fragment>,
    guideSectionElement
  )
};
