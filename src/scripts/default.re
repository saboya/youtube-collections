[%%raw {|
  /*__TYPE__: "content"*/
  /*__MATCHES__: ["https://www.youtube.com/*"]*/
  /*__RUN_AT__: "document_idle"*/
|}];

[@bs.val] [@bs.module "react-dom"] external renderToFragment : ReasonReact.reactElement => Dom.documentFragment => unit =
  "render";
let collectionIcon : string = [%bs.raw {|require('../../../../src/icons/collections-48.png')|}];
[%bs.raw {|require('../../../../src/teste.css')|}];

Chrome.Storage.Sync.set([%bs.obj {
  "collections": [|"Mashups"|],
  "collections.Mashups": [%bs.obj {
    "label": "Mashups",
    "counter": 0,
    "subscriptions": [|"UC-_SoG6x0XvcQRgQEh7Ce9Q", "UC9ecwl3FTG66jIKA9JRDtmg"|]
  }]
}]);

let _element = Webapi.Dom.Document.createDocumentFragment(Webapi.Dom.document);

renderToFragment(<GuideLoaded render=((collectionSectionElement) => {
  <Collections render=(collections => {
    <YtSubscriptions render=(subscriptions => {
      <GuideSection guideSectionElement={collectionSectionElement}>
        <YT.Guide.SectionTitle>
          {ReasonReact.stringToElement("Collections")}
        </YT.Guide.SectionTitle>
        <YT.Guide.SectionItems>
          <Fragment>
            {Array.mapi((i: int, id: string) => {
              let sub = Js.Dict.get(collections, id) |> Util.unwrapUnsafely;
              <YT.Guide.SectionItem
                key={Js.String.make(i)}
                label={sub.label}
                image={collectionIcon}
                uri={"#"}
                counter={sub.counter}
              />;
            }, Js.Dict.keys(collections))}
            </Fragment>
        </YT.Guide.SectionItems>
        <YT_Dropdown left="100px" top="100px" open_={true}>
          {ReasonReact.arrayToElement({Array.mapi((i: int, id: string) => {
            let sub = Js.Dict.get(collections, id) |> Util.unwrapUnsafely;
            <YT_Dropdown.Item key={Js.String.make(i)} checked={true}>
              {ReasonReact.stringToElement(sub.label)}
            </YT_Dropdown.Item>;
          }, Js.Dict.keys(collections))})}
        </YT_Dropdown>
      </GuideSection>
    })/>
  }) />
}) />, _element);
