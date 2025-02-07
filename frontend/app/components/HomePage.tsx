"use client";

import Image from "next/image";
import { useReducer } from "react";
import FileUpload from "./FileUpload";
import ResultDisplay from "./ResultDisplay";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../loading";

export default function HomePage() {
  const initState = {
    uploadPage: true,
    policy: "policy_1",
    file: undefined as File | undefined,
    loading: false,
    results: undefined as
      | {
          SCORE: number;
          ASSESSMENT: string[];
          REMEDIES: string[];
        }
      | undefined,
  };

  const [state, dispatch] = useReducer(
    (state: typeof initState, action: TAction) => {
      if (action.type === "changedField") {
        return { ...state, [action.payload.field]: action.payload.value };
      }
      if (action.type === "fileUploaded") {
        return { ...state, file: action.payload };
      }
      if (action.type === "fileSubmitClicked") {
        return { ...state, loading: true };
      }
      if (action.type === "fileSubmitted") {
        return { ...state, results: action.payload, loading: false, uploadPage: false };
      }
      if (action.type === "fileSubmitFailed") {
        return { ...state, loading: false };
      }
      if (action.type === "reassessClicked") {
        return { ...state, uploadPage: true };
      }
      return state;
    },
    initState
  );

  const handleFieldChange = (field: string, value: string) => {
    dispatch({ type: "changedField", payload: { field, value } });
  };

  const handleFileUpload = (file: File) => {
    dispatch({ type: "fileUploaded", payload: file });
  };

  const handleFileSubmit = async () => {
    try {
      if (!state.file) {
        toast.error("Please upload a file");
        return;
      }
      dispatch({ type: "fileSubmitClicked" });
      const formData = new FormData();
      formData.append("file1", state.file);
      formData.append("body", `{ "policy": "${state.policy}" }`);
      const response = await fetch("http://localhost:5143/upload", {
        method: "POST",
        body: formData,
      });
      const results = await response.json();
      dispatch({ type: "fileSubmitted", payload: results });
    } catch {
      toast.error("Something went wrong");
      dispatch({ type: "fileSubmitFailed" });
    }
  };

  const handleReAssessClick = () => {
    dispatch({ type: "reassessClicked" });
  };

  if (state.loading) {
    return <Loading />;
  };

  return (
    <div className="prose flex flex-col w-[60%] items-center gap-2">
      <Image src="/images/logo.png" alt="logo" width={300} height={100} />
      {state.uploadPage ? (
        <FileUpload
          uploadedFile={state.file}
          handleFieldChange={handleFieldChange}
          handleFileUpload={handleFileUpload}
          handleFileSubmit={handleFileSubmit}
        />
      ) : (
        <ResultDisplay
          handleReAssessClick={handleReAssessClick}
          results={state.results}
        />
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
