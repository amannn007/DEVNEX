// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// QuizResult Schema
const quizResultSchema = new mongoose.Schema({
    user: String,
    score: Number,
    date: { type: Date, default: Date.now }
});

const QuizResult = mongoose.model("QuizResult", quizResultSchema);

// Custom Quiz Schema
const customQuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        correct_answer: { type: String, required: true },
        incorrect_answers: { type: [String], required: true }
      }
    ]
  });

const CustomQuiz = mongoose.model("CustomQuiz", customQuizSchema);

// Fetch questions from Trivia API with category and difficulty
app.get("/api/questions", async (req, res) => {
    const { category, difficulty } = req.query;
    
    const apiUrl = `https://opentdb.com/api.php?amount=10&type=multiple${
        category ? `&category=${category}` : ""
    }${difficulty ? `&difficulty=${difficulty}` : ""}`;
    
    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch questions" });
    }
});

// Save quiz result
app.post("/api/results", async (req, res) => {
    const { user, score } = req.body;

    try {
        const result = new QuizResult({ user, score });
        await result.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to save result" });
    }
});

// Fetch custom quizzes
app.post("/api/custom-quizzes", async (req, res) => {
    const { title, questions } = req.body;
  
    if (!title || questions.length === 0) {
      return res.status(400).json({ error: "Quiz title and questions are required" });
    }
  
    try {
      const customQuiz = new CustomQuiz({ title, questions });
      await customQuiz.save();  // Save the custom quiz to MongoDB
      res.status(201).json(customQuiz);  // Send response
    } catch (error) {
      console.error("Error saving quiz:", error);
      res.status(500).json({ error: "Failed to save quiz" });
    }
  });
  
  // Route to get all custom quizzes
  app.get("/api/custom-quizzes", async (req, res) => {
    try {
      const quizzes = await CustomQuiz.find();
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  });

  
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
