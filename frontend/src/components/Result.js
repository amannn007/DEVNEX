import React from "react";
import { useLocation } from "react-router-dom";
import '../App.css'
const Result = () => {
  const location = useLocation();
  const { score } = location.state;

  return (
    <div>
      <h1>Your Score: {score}</h1>
    </div>
  );
};

export default Result;
