const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/resources/flashcards - list flashcard decks
router.get('/flashcards', (req, res) => {
  const { category } = req.query;
  let decks = db.read().get('flashcardDecks').value() || [];

  if (category && category !== 'All') {
    decks = decks.filter((d) => d.category === category);
  }

  res.json(decks);
});

// GET /api/resources/cheatsheets - list code cheat sheets
router.get('/cheatsheets', (req, res) => {
  const { category, search } = req.query;
  let sheets = db.read().get('cheatsheets').value() || [];

  if (category && category !== 'All') {
    sheets = sheets.filter((s) => s.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    sheets = sheets.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  res.json(sheets);
});

module.exports = router;
