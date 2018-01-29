open Webapi.Dom;


[@bs.val] [@bs.module "react-dom"] external renderToFragment : ReasonReact.reactElement => Dom.documentFragment => unit =
  "render" ;

let _element = Document.createDocumentFragment(document);

/* ReactDOMRe.renderToElementWithId(<Page />, "main"); */
renderToFragment(<GuideLoaded render=(() => {
  <Guide>
    <GuideSection title="Collections" />
  </Guide>
}) />, _element);
