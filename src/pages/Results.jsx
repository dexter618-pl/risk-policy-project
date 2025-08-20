import React, { useState } from "react";
import { useLocation } from "react-router-dom";

// ✅ Import API functions
import { generatePolicy, downloadReport } from "../api";

const Results = () => {
  const { state } = useLocation();
  const { score, assessmentId, recommendations, answers } = state || {};

  const [policy, setPolicy] = useState("");

  const handleGeneratePolicy = async () => {
    try {
      const res = await generatePolicy({
        assessment_id: assessmentId,
        recommendations,
      });
      setPolicy(res.data.policy);
    } catch (error) {
      console.error("Error generating policy:", error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const payload = {
        assessment_id: assessmentId,
        answers,
        score,
        recommendations,
        policy,
      };

      // ✅ generateReport already returns a blob in api.js
      const response = await downloadReport(payload);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "assessment_report.pdf";
      link.click();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Assessment Results</h1>

      <div className="p-4 border rounded shadow mb-6">
        <h2 className="text-lg font-semibold">Your Score: {score}</h2>
      </div>

      <div className="p-4 border rounded shadow mb-6">
        <h3 className="font-semibold">AI Recommendations</h3>
        <p className="p-2 bg-gray-100 rounded">{recommendations}</p>
      </div>

      <button
        onClick={handleGeneratePolicy}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow"
      >
        Generate Policy
      </button>

      {policy && (
        <div className="mt-4 p-4 border rounded shadow bg-gray-50">
          <h3 className="font-semibold">Generated Policy</h3>
          <p className="whitespace-pre-line">{policy}</p>
        </div>
      )}

      <button
        onClick={handleDownloadReport}
        className="mt-4 bg-purple-500 text-white px-4 py-2 rounded shadow"
      >
        Download Report
      </button>
    </div>
  );
};

export default Results;
