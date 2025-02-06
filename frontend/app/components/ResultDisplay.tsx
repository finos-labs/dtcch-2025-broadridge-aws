"use client";

import { RotateCw } from "lucide-react";
import { Dispatch } from "react";
import ReactSpeedometer from "react-d3-speedometer";

export default function ResultDisplay({
  homeDispatch,
}: Readonly<{ homeDispatch: Dispatch<TAction> }>) {
  const response = {
    SCORE: 4,
    ASSESSMENT: [
      "• Loan amount (150,000) exceeds polic ymaximum of 100,000",
      "• Tenure requested (60months) exceeds policy maximum of 12 months",
      "• Age (48years) is with inacceptable range for current application",
      "• CIBIL score (651) is barely above minimum requirement of 650",
      "• Current FOIR with existing home loan EMI (26.7%) is with inacceptable range for salary bracket",
      "• While government employment is favorable, other risk parameters place this application in high riskcategory",
    ],
    REMEDIES: [
      "• Reduce loan amount request to with inpolicy maximum of 100,000",
      "• Adjust loan tenure to 12 months as per policy",
      "• Work on improving CIBIL score above 700 for better risk rating",
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col">
      <div className="flex justify-between items-end">
        <h2 className="mb-0">Credit Worthiness Report</h2>
        <button
          className="flex items-center gap-2 text-red-700 rounded hover:border-red-800 hover:text-red-800 transition duration-300 ease-in-out"
          onClick={() => homeDispatch({ type: "reset" })}
        >
          <RotateCw />
          Assess Another
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <ReactSpeedometer minValue={1} maxValue={5} segments={5} value={response.SCORE} startColor="#33CC33" endColor="#FF471A" />
      </div>
    </div>
  );
}
