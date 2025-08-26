import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  

// ✅ import API functions
import {
  fetchQuestions,
  submitAssessment,
  fetchRecommendations,
  generatePolicy,
  downloadReport,
} from "../api";

// MUI components
import {
  Container,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Assessment = () => {
  const [questions, setQuestions] = useState([]);  
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [recommendations, setRecommendations] = useState("");
  const [policy, setPolicy] = useState("");
  const [assessmentId, setAssessmentId] = useState(null);
  const navigate = useNavigate(); 

  // ✅ Load questions
  useEffect(() => {
    fetchQuestions()
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.error("Questions response is not an array:", data);
          setQuestions([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setQuestions([]);
      });
  }, []);

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        answers: Object.keys(answers).map((id) => ({
          questionId: parseInt(id, 10),
          answer: answers[id],
        })),
      };

      // ✅ Submit assessment
      const res = await submitAssessment(payload);
      console.log("Backend /submit-assessment response:", res);

      setScore(res.score);
      setAssessmentId(res.assessment_id);

      // ✅ Fetch AI recommendations
      const recRes = await fetchRecommendations(res.assessment_id, res.score);
      console.log("Backend /ai-recommendations response:", recRes);

      setRecommendations(recRes?.recommendations || "");

      navigate("/results", {
        state: {
          score: res.score,
          assessmentId: res.assessment_id,
          recommendations: recRes?.recommendations || "",
          answers,
        },
      });
    } catch (error) {
      console.error("Error submitting or fetching recommendations:", error);
    }
  };

  const handleGeneratePolicy = async () => {
    try {
      if (!assessmentId) {
        alert("Please complete the assessment first.");
        return;
      }

      // ✅ api.generatePolicy already returns res.data
      const policyRes = await generatePolicy({
        assessment_id: assessmentId,
        recommendations: recommendations,
      });

      console.log("Backend /generate-policy response:", policyRes);
      setPolicy(policyRes?.policy || "");
    } catch (error) {
      console.error("Error generating policy:", error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const payload = {
        assessment_id: assessmentId,
        answers: answers, 
        score: score,
        recommendations: recommendations,
        policy: policy,
      };

      // ✅ api.downloadReport should return the blob directly
      const response = await downloadReport(payload);

      console.log("Backend /download-report response:", response);

      const blob = new Blob([response], { type: "application/pdf" });
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Card */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Security Risk Assessment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Answer the guided questions below. When you submit, you’ll get a score
          and AI-driven recommendations. You can also generate a tailored policy
          and download a PDF report.
        </Typography>
      </Paper>

      {/* Questions */}
      <Box>
        {!questions || questions.length === 0 ? (
          <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1">Loading questions…</Typography>
          </Paper>
        ) : (
          questions.map((q) => (
            <Accordion
              key={q.id}
              disableGutters
              sx={{
                mb: 1.5,
                borderRadius: 2,
                overflow: "hidden",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {q.question}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Framework: {q.framework} • Control: {q.control}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth>
                  <InputLabel id={`label-${q.id}`}>Select an answer</InputLabel>
                  <Select
                    labelId={`label-${q.id}`}
                    label="Select an answer"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="Partially">Partially</MenuItem>
                  </Select>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          ))
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
          >
            Submit
          </Button>

          {score !== null && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleGeneratePolicy}
              >
                Generate Policy
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownloadReport}
              >
                Download Report
              </Button>
            </>
          )}
        </Stack>
      </Box>

      {/* Results / Recommendations / Policy */}
      {score !== null && (
        <Paper elevation={1} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Your Score: {score}
          </Typography>

          {recommendations && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                AI Recommendations
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-line", mt: 1 }}
              >
                {recommendations}
              </Typography>
            </>
          )}

          {policy && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Generated Policy
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-line", mt: 1 }}
              >
                {policy}
              </Typography>
            </>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default Assessment;






