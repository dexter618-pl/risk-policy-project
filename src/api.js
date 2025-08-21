// src/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Fetch all assessments
//export const fetchQuestions = async () => {
  //const res = await axios.get(`${API_BASE}/questions`);
  //return res.data;
//};

// Fetch all questions
export const fetchQuestions = async () => {
  const res = await axios.get(`${API_BASE}/questions`);
  return res.data;
};

// Submit an assessment
export const submitAssessment = async (payload) => {
  const res = await axios.post(`${API_BASE}/submit-assessment`, payload);
  return res.data;
};

// Fetch AI recommendations
export const fetchRecommendations = async (assessmentId, score) => {
  const res = await axios.post(`${API_BASE}/ai-recommendations`, {
    assessment_id: assessmentId,
    score,
  });
  return res.data;
};

// Generate policy
export const generatePolicy = async (assessmentId, recommendations) => {
  const res = await axios.post(`${API_BASE}/generate-policy`, {
    assessment_id: assessmentId,
    recommendations,
  });
  return res.data;
};

// Download PDF report
export const downloadReport = async (payload) => {
  const res = await fetch(`${API_BASE}/generate-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to download report");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "assessment_report.pdf";
  link.click();
};
