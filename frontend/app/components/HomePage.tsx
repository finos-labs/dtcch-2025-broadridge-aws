"use client";

import Image from "next/image";
import { useReducer } from "react";
import FileUpload from "./FileUpload";
import ResultDisplay from "./ResultDisplay";

export default function HomePage() {
  const initState = {
    uploadPage: true,
    policy: "policy_1",
  }
  
  const [state, dispatch] = useReducer((state: typeof initState, action: TAction) => {
    if (action.type === "changedField") {
      return { ...state, [action.field]: action.value };
    }    
    if(action.type === "fileSubmitted") {
      return { ...state, uploadPage: false }
    }
    if (action.type === "reset") {
      return initState;
    }
    return state
  }, initState);

  return (
    <div className="prose flex flex-col w-[60%] items-center gap-2 p-8">
      <Image src="/images/logo.png" alt="logo" width={300} height={100} />
      {state.uploadPage ? <FileUpload homeDispatch={dispatch} /> : <ResultDisplay homeDispatch={dispatch} />}
    </div>
  );
}
