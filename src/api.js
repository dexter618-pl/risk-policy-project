// src/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

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

// Generate policy (expects payload object)
export const generatePolicy = async (payload) => {
  const res = await axios.post(`${API_BASE}/generate-policy`, payload);
  return res.data;
};

// Download PDF report (returns Blob, frontend handles saving)
export const downloadReport = async (payload) => {
  const res = await fetch(`${API_BASE}/generate-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to download report");

  return await res.blob(); // return blob to Assessment.jsx
};
