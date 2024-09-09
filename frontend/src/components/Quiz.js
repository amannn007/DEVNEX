import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../App.css'
const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 21, name: "Sports" },
  { id: 23, name: "History" },
  { id: 17, name: "Science & Nature" },
  // Add more categories as needed
];

const difficulties = ["easy", "medium", "hard"];

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [feedback, setFeedback] = useState(""); // Feedback state
  const [timer, setTimer] = useState(10); // Timer state, 10 seconds per question
  const navigate = useNavigate();

  useEffect(() => {
    // Countdown timer logic
    if (quizStarted && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      // Clean up the interval on component unmount
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      handleNextQuestion();
    }
  }, [quizStarted, timer]);

  const fetchQuestions = () => {
    axios
      .get(`http://localhost:5000/api/questions`, {
        params: { category, difficulty },
      })
      .then((response) => {
        setQuestions(response.data.results);
        setQuizStarted(true);
        setTimer(10); // Reset timer when quiz starts
      })
      .catch((error) => console.error(error));
  };

  const handleAnswerClick = (answer) => {
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect!"); // Show feedback for incorrect answers
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1000); // Show feedback for 1 second before moving to next question
  };

  const handleNextQuestion = () => {
    setFeedback(""); // Reset feedback
    setTimer(10); // Reset timer for the next question

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      axios
        .post("http://localhost:5000/api/results", { user: "Anonymous", score })
        .then(() => navigate("/result", { state: { score } }));
    }
  };

  if (!quizStarted) {
    return (
      <div>
        <h1>Select Category and Difficulty</h1>

        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Any Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Difficulty:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Any Difficulty</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button onClick={fetchQuestions}>Start Quiz</button>
      </div>
    );
  }

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h1>Quiz</h1>
      <h2>{questions[currentQuestion].question}</h2>

      <div>
        <strong>Time Left: {timer} seconds</strong> {/* Timer display */}
      </div>

      {questions[currentQuestion].incorrect_answers
        .concat(questions[currentQuestion].correct_answer)
        .sort()
        .map((answer, index) => (
          <button key={index} onClick={() => handleAnswerClick(answer)} disabled={feedback}>
            {answer}
          </button>
        ))}

      {feedback && <div>{feedback}</div>} {/* Feedback display */}
    </div>
  );
};

export default Quiz;
