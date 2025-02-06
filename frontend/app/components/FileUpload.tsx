"use client";

import { Dispatch, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ homeDispatch }: { homeDispatch: Dispatch<TAction> }) => {
  const onDrop = useCallback(() => {}, []);

  const dropZoneAccept = {
    "text/csv": [".csv"],
    "image/jpeg": [".jpg", ".jpeg"],
    "application/pdf": [".pdf"],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: dropZoneAccept,
    multiple: false,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col">
      <h2>Assess Credit Worthiness</h2>
      <label htmlFor="policy">Select a policy</label>
      <select
        className="border border-gray-300 rounded-md p-2 w-[50%]"
        id="policy"
        onChange={e => {
          homeDispatch({ type: "changedField", field: "policy", value: e.target.value });
        }}
      >
        <option value="policy_1">Policy 1</option>
        <option value="policy_2">Policy 2</option>
        <option value="policy_3">Policy 3</option>
      </select>
      <label htmlFor="file" className="mt-2">
        Upload loan application
      </label>
      <div
        {...getRootProps()}
        className={`h-[192px] border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition duration-300 ease-in-out ${
          isDragActive ? "border-red-500 bg-red-50" : "hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-red-500">Drop the file here...</p>
        ) : (
          <>
            <p>Drag and drop your file here or</p>
            <button className="mt-2 px-4 py-2 border-2 border-red-700 text-red-700 rounded hover:border-red-800 hover:text-red-800 transition duration-300 ease-in-out">
              Click to browse
            </button>
          </>
        )}
      </div>
      <p className="mt-0 text-sm text-gray-600">
        {`Supported file types: ${Object.values(dropZoneAccept)
          .flatMap((map) => map)
          .join(", ")}`}
      </p>
      <button
        onClick={() => homeDispatch({ type: "fileSubmitted" })}
        className="mt-2 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition duration-300 ease-in-out"
      >
        Submit
      </button>
    </div>
  );
};

export default FileUpload;
