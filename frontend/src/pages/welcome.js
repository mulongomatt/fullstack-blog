import React from "react";
import { Link } from "react-router-dom";
import "./welcome.css";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome to the Developer Blog System</h1>
      <p>
        Share your knowledge, read insightful articles, and explore the latest in tech!
      </p>
      <div className="welcome-buttons">
        <Link to="/login" className="btn">
          Login
        </Link>
        <Link to="/register" className="btn btn-secondary">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
