"use server";

import { Dispatch, SetStateAction } from "react";

export const handleFileUpload = async (
  uploadedFile: File[],
  setIsProcessing: Dispatch<SetStateAction<boolean>>,
  setGotResults: Dispatch<SetStateAction<boolean>>,
) => {
  const temp = uploadedFile;
  console.log(temp);
  setIsProcessing(true);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  setIsProcessing(false);
  setGotResults(true);
};
