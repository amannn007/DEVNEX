import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../App.css'
const CustomQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/custom-quizzes")
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, []);

  const handleTakeQuiz = (quiz) => {
    navigate(`/custom-quiz/${quiz._id}`, { state: { quiz } });
  };

  return (
    <div>
      <h1>Available Custom Quizzes</h1>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>
            <strong>{quiz.title}</strong>
            <button onClick={() => handleTakeQuiz(quiz)}>Take Quiz</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomQuizList;
