"use client";

import { RotateCw } from "lucide-react";
import ReactSpeedometer from "react-d3-speedometer";

export default function ResultDisplay({
  handleReAssessClick,
  results,
}: Readonly<{
  handleReAssessClick: () => void;
  results: { SCORE: number; ASSESSMENT: string[]; REMEDIES: string[] } | undefined;
}>) {
  const scores: Record<number, string> = {
    1: "Risk-free",
    2: "Low risk",
    3: "Medium risk",
    4: "High risk",
    5: "Unacceptable risk",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col">
      <div className="flex justify-between items-end">
        <h2 className="mb-0">Credit Worthiness Report</h2>
        <button
          className="flex items-center gap-2 text-red-700 rounded hover:border-red-800 hover:text-red-800 transition duration-300 ease-in-out"
          onClick={() => handleReAssessClick()}
        >
          <RotateCw />
          Assess Another
        </button>
      </div>
      {results ? <div className="flex flex-col">
        <div className="flex gap-8 h-[150px] mt-4">
          <h3>Risk Score: {results.SCORE}</h3>
          <ReactSpeedometer
            width={200}
            needleHeightRatio={0.4}
            value={results.SCORE}
            minValue={1}
            maxValue={5}
            startColor="#33CC33"
            endColor="#FF0000"
            currentValueText={scores[results.SCORE]}
            maxSegmentLabels={5}
            ringWidth={40}
          />
        </div>
        <h3 className="m-0">Assessment</h3>
        <ul className="list-none">
          {results.ASSESSMENT.map((item, index) => (
            <li key={index + 1}>{item}</li>
          ))}
        </ul>
        {results.REMEDIES.length > 0 && <h3 className="m-0">Remedies</h3>}
        <ul className="list-none">
          {results.REMEDIES.map((item, index) => (
            <li key={index + 1}>{item}</li>
          ))}
        </ul>
      </div> : (
        <div className="flex flex-col mt-4 items-center">
          <h3 className="m-0">No Results</h3>
          <p className="m-0">Please enter a valid file and click the submit button</p>
        </div>
      )}
    </div>
  );
}
