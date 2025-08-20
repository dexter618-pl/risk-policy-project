import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // <-- import the CSS file we’ll create

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">
        Security Risk Assessment & Policy Generator
      </h1>

      <div className="card-grid">
        {/* Start Assessment Card */}
        <div className="card" onClick={() => navigate("/assessment")}>
          <h2 className="card-title">Start Assessment</h2>
          <p className="card-text">
            Answer security questions to evaluate your organization’s risk level.
          </p>
          <button className="card-button card-button-blue">Begin</button>
        </div>

        {/* View Results Card */}
        <div className="card" onClick={() => navigate("/results")}>
          <h2 className="card-title">View Results</h2>
          <p className="card-text">
            Check your latest assessment score, AI recommendations, and reports.
          </p>
          <button className="card-button card-button-green">View</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
