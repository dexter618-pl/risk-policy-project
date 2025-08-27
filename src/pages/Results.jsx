// src/components/Results.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { generatePolicy, downloadReport } from "../api";

const Results = () => {
  const { state } = useLocation();
  const { score, assessmentId, recommendations, answers } = state || {};

  const [policy, setPolicy] = useState("");

  const handleGeneratePolicy = async () => {
    try {
      const res = await generatePolicy({
        assessment_id: assessmentId,
        recommendations: recommendations,
      });
      console.log("Backend /generate-policy response:", res);
      setPolicy(res.policy);
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
      await downloadReport(payload);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <div className="results-container">
      <h2>Assessment Results</h2>
      <p><strong>Score:</strong> {score}</p>

      <h3>Recommendations</h3>
      <pre>{recommendations || "No recommendations available."}</pre>

      <button onClick={handleGeneratePolicy}>Generate Policy</button>

      {policy && (
        <>
          <h3>Generated Policy</h3>
          <pre>{policy}</pre>
        </>
      )}

      <button onClick={handleDownloadReport}>Download PDF Report</button>
    </div>
  );
};

export default Results;
