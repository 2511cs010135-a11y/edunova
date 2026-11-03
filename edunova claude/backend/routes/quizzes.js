const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/quizzes - list all quizzes with optional filter
router.get('/', (req, res) => {
  const { category, difficulty, search } = req.query;
  let quizzes = db.read().get('quizzes').value() || [];

  if (category && category !== 'All') {
    quizzes = quizzes.filter((q) => q.category === category);
  }
  if (difficulty && difficulty !== 'All') {
    quizzes = quizzes.filter((q) => q.difficulty === difficulty);
  }
  if (search) {
    const q = search.toLowerCase();
    quizzes = quizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(q) ||
        quiz.description.toLowerCase().includes(q) ||
        quiz.category.toLowerCase().includes(q)
    );
  }

  // Sanitize questions to hide correct answers on list view
  const summary = quizzes.map((qz) => ({
    id: qz.id,
    title: qz.title,
    category: qz.category,
    difficulty: qz.difficulty,
    timeLimit: qz.timeLimit,
    description: qz.description,
    questionCount: qz.questions ? qz.questions.length : 0
  }));

  res.json(summary);
});

// GET /api/quizzes/mine/results - user quiz results (must come before /:id)
router.get('/mine/results', requireAuth, (req, res) => {
  const results = db.get('quizResults').filter({ userId: req.user.id }).value() || [];
  const quizzes = db.get('quizzes').value() || [];

  const enriched = results.map((r) => {
    const quiz = quizzes.find((q) => q.id === r.quizId);
    return {
      ...r,
      quizTitle: quiz ? quiz.title : 'Quiz',
      category: quiz ? quiz.category : 'General'
    };
  });

  res.json(enriched);
});

// GET /api/quizzes/:id - get full quiz details (without correct answer indices shown directly unless submitting)
router.get('/:id', (req, res) => {
  const quiz = db.get('quizzes').find({ id: req.params.id }).value();
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  // Hide correctIndex for active test taker
  const sanitized = {
    ...quiz,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options
    }))
  };

  res.json(sanitized);
});

// POST /api/quizzes/:id/submit - submit quiz answers
router.post('/:id/submit', (req, res) => {
  const quiz = db.get('quizzes').find({ id: req.params.id }).value();
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const { answers, timeTakenSec } = req.body; // answers = { q1: 1, q2: 0, ... }
  if (!answers) {
    return res.status(400).json({ error: 'Answers dictionary required' });
  }

  let score = 0;
  const total = quiz.questions.length;
  const breakdown = quiz.questions.map((q) => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctIndex;
    if (isCorrect) score += 1;
    return {
      questionId: q.id,
      question: q.question,
      userAnswer,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const percentage = Math.round((score / total) * 100);

  const resultRecord = {
    id: uuidv4(),
    quizId: quiz.id,
    userId: req.user ? req.user.id : 'guest',
    score,
    total,
    percentage,
    timeTakenSec: timeTakenSec || 0,
    submittedAt: new Date().toISOString(),
    breakdown
  };

  if (req.user) {
    db.get('quizResults').push(resultRecord).write();
  }

  res.json(resultRecord);
});

module.exports = router;
