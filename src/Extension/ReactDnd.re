[@bs.module] external dragDropContextClass : ReasonReact.reactClass = "DragDropContext";
[@bs.module] external droppableClass : ReasonReact.reactClass = "Droppable";
[@bs.module] external draggableClass : ReasonReact.reactClass = "Draggable";

type draggableLocation = {
  droppableId: string,
  index: int
};

type dragStart = {.
  "type": string,
  "draggableId": string,
  "source": draggableLocation,
};

type dragResult = {.
  "type": string,
  "draggableId": string,
  "source": draggableLocation,
  "destination": Js.Nullable.t(draggableLocation)
};

module DragDropContext {
  let make = (
    ~onDragEnd: (dragResult) => unit,
    ~onDragStart: option((dragStart) => unit)=?,
    children
  ) => {
    ReasonReact.wrapJsForReason(
      ~reactClass=dragDropContextClass,
      ~props={
        "onDragStart": Js.Nullable.from_opt(onDragStart),
        "onDragEnd": onDragEnd
      },
      children
    );
  };
};

module Droppable {
  type droppableStateSnapshot = {
    isDraggingOver: bool,
  };
  
  type droppableProvided = {
    innerRef: (Dom.element) => unit,
    placeholder: ReasonReact.reactElement
  };

  let make = (
    ~droppableId: string,
    ~isDropDisabled: bool = false,
    ~direction: string = "vertical",
    ~_type: option(string)=?,
    children: (~provided: droppableProvided, ~snapshot: droppableStateSnapshot) => ReasonReact.reactElement
  ) => {
    ReasonReact.wrapJsForReason(
      ~reactClass=droppableClass,
      ~props={
        "droppableId": droppableId,
        "type": Js.Nullable.from_opt(_type),
        "isDropDisabled": isDropDisabled,
        "direction": direction
      },
      children
    );
  };
};

module Draggable {
  type draggableStateSnapshot = {
    isDraggingOver: bool,
  };
  
  type draggableProvided = {
    innerRef: (Dom.element) => unit,
    placeholder: option(ReasonReact.reactElement)
  };
  let make = (
    ~droppableId: string,
    ~isDropDisabled: bool = false,
    ~direction: string = "vertical",
    ~_type: option(string)=?,
    children: (~provided: draggableProvided, ~snapshot: draggableStateSnapshot) => ReasonReact.reactElement
  ) => {
    ReasonReact.wrapJsForReason(
      ~reactClass=draggableClass,
      ~props={
        "droppableId": droppableId,
        "type": Js.Nullable.from_opt(_type),
        "isDropDisabled": isDropDisabled,
        "direction": direction
      },
      children
    );
  };
};
