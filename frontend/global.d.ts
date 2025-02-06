declare global {
    type TAction = {
      type: "changedField";
      field: string;
      value: string;
    } | {
      type: "fileSubmitted";
    } | {
      type: "reset";
    }
}

export {};