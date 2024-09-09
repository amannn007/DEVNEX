const express = require('express');
const Quiz = require('../models/Quiz');
const router = express.Router();

// Save quiz answers
router.post('/save', async (req, res) => {
    const { question, selectedAnswer, correctAnswer } = req.body;

    // Validate request body
    if (!question || !selectedAnswer || !correctAnswer) {
        return res.status(400).json({ error: 'Missing fields in request' });
    }

    try {
        const quiz = new Quiz({
            question,
            selectedAnswer,
            correctAnswer,
        });
        await quiz.save();
        res.json({ message: 'Answer saved successfully' });
    } catch (error) {
        console.error('Error saving quiz answer:', error);
        res.status(500).json({ error: 'Error saving quiz answer' });
    }
});

module.exports = router;
