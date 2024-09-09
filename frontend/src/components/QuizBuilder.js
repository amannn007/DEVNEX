import React, { useState } from "react";
import axios from "axios";
import '../App.css'
const QuizBuilder = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    correct_answer: "",
    incorrect_answers: ["", "", ""],
  });

  const handleQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, question: e.target.value });
  };

  const handleCorrectAnswerChange = (e) => {
    setNewQuestion({ ...newQuestion, correct_answer: e.target.value });
  };

  const handleIncorrectAnswerChange = (index, e) => {
    const updatedIncorrectAnswers = [...newQuestion.incorrect_answers];
    updatedIncorrectAnswers[index] = e.target.value;
    setNewQuestion({ ...newQuestion, incorrect_answers: updatedIncorrectAnswers });
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ question: "", correct_answer: "", incorrect_answers: ["", "", ""] });
  };

  const handleSubmitQuiz = () => {
    const quizData = { title: quizTitle, questions };

    // Check if title and questions are provided before submission
    if (!quizTitle || questions.length === 0) {
      alert("Please provide a quiz title and at least one question.");
      return;
    }

    // Send the quiz data to the backend
    axios
      .post("http://localhost:5000/api/custom-quizzes", quizData)
      .then((response) => {
        console.log("Quiz saved:", response.data);
        alert("Quiz successfully saved!");
        setQuizTitle("");
        setQuestions([]);
      })
      .catch((error) => {
        console.error("Error saving quiz:", error);
        alert("Error saving quiz");
      });
  };

  return (
    <div>
      <h1>Create Custom Quiz</h1>
      <div>
        <label>Quiz Title:</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />
      </div>
      <div>
        <h2>New Question</h2>
        <label>Question:</label>
        <input
          type="text"
          value={newQuestion.question}
          onChange={handleQuestionChange}
        />
        <label>Correct Answer:</label>
        <input
          type="text"
          value={newQuestion.correct_answer}
          onChange={handleCorrectAnswerChange}
        />
        <label>Incorrect Answers:</label>
        {newQuestion.incorrect_answers.map((answer, index) => (
          <input
            key={index}
            type="text"
            value={answer}
            onChange={(e) => handleIncorrectAnswerChange(index, e)}
          />
        ))}
        <button onClick={handleAddQuestion}>Add Question</button>
      </div>
      <h2>Questions Preview</h2>
      <ul>
        {questions.map((q, index) => (
          <li key={index}>
            <strong>{q.question}</strong>
            <br />
            Correct Answer: {q.correct_answer}
            <br />
            Incorrect Answers: {q.incorrect_answers.join(", ")}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmitQuiz}>Save Quiz</button>
    </div>
  );
};

export default QuizBuilder;
