declare global {
  type TAction = {
    type: "changedField";
    payload: {
      field: string;
      value: string | File | boolean;
    }
  } | {
    type: "fileUploaded";
    payload: File
  } | {
    type: "fileSubmitClicked" | "fileSubmitFailed" | "reassessClicked";
  } | {
    type: "fileSubmitted";
    payload: {
      SCORE: number;
      ASSESSMENT: string[];
      REMEDIES: string[];
    }
  }
}

export { };