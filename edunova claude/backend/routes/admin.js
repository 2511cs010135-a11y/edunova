const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply requireAdmin middleware to ALL admin routes
router.use(requireAdmin);

// ==========================================
// 1. STATS OVERVIEW
// ==========================================
router.get('/stats', (req, res) => {
  const currentDb = db.read();
  const users = currentDb.get('users').value() || [];
  const events = currentDb.get('events').value() || [];
  const roadmaps = currentDb.get('roadmaps').value() || [];
  const quizzes = currentDb.get('quizzes').value() || [];
  const teams = currentDb.get('teams').value() || [];
  const flashcards = currentDb.get('flashcardDecks').value() || [];
  const cheatsheets = currentDb.get('cheatsheets').value() || [];
  const registrations = currentDb.get('registrations').value() || [];

  res.json({
    totalUsers: users.length,
    totalAdmins: users.filter((u) => u.role === 'admin').length,
    totalEvents: events.length,
    totalRoadmaps: roadmaps.length,
    totalQuizzes: quizzes.length,
    totalTeams: teams.length,
    totalFlashcards: flashcards.length,
    totalCheatsheets: cheatsheets.length,
    totalRegistrations: registrations.length
  });
});

// ==========================================
// 2. USERS MANAGEMENT
// ==========================================
router.get('/users', (req, res) => {
  const users = db.read().get('users').value() || [];
  const sanitized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    college: u.college,
    role: u.role || 'user',
    createdAt: u.createdAt
  }));
  res.json(sanitized);
});

router.put('/users/:id/role', (req, res) => {
  const { role } = req.body;
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Role must be admin or user' });
  }

  const user = db.get('users').find({ id: req.params.id }).value();
  if (!user) return res.status(404).json({ error: 'User not found' });

  db.get('users').find({ id: req.params.id }).assign({ role }).write();
  res.json({ success: true, id: user.id, role });
});

router.delete('/users/:id', (req, res) => {
  const user = db.get('users').find({ id: req.params.id }).value();
  if (!user) return res.status(404).json({ error: 'User not found' });

  db.get('users').remove({ id: req.params.id }).write();
  res.json({ success: true, message: 'User deleted' });
});

// ==========================================
// 3. EVENTS MANAGEMENT
// ==========================================
router.post('/events', (req, res) => {
  const { title, type, mode, location, startDate, endDate, registrationDeadline, capacity, tags, description, prize, organizer } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and Description are required' });
  }

  const newEvent = {
    id: `evt-${uuidv4().slice(0, 8)}`,
    title,
    type: type || 'hackathon',
    mode: mode || 'Online',
    location: location || 'Online',
    startDate: startDate || new Date().toISOString(),
    endDate: endDate || new Date(Date.now() + 86400000).toISOString(),
    registrationDeadline: registrationDeadline || new Date(Date.now() + 43200000).toISOString(),
    capacity: Number(capacity) || 500,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : ['General']),
    description,
    prize: prize || null,
    organizer: organizer || 'EduNova Admin'
  };

  db.get('events').push(newEvent).write();
  res.status(201).json(newEvent);
});

router.put('/events/:id', (req, res) => {
  const event = db.get('events').find({ id: req.params.id }).value();
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const { title, type, mode, location, startDate, endDate, registrationDeadline, capacity, tags, description, prize, organizer } = req.body;

  const updated = {
    ...event,
    title: title !== undefined ? title : event.title,
    type: type !== undefined ? type : event.type,
    mode: mode !== undefined ? mode : event.mode,
    location: location !== undefined ? location : event.location,
    startDate: startDate !== undefined ? startDate : event.startDate,
    endDate: endDate !== undefined ? endDate : event.endDate,
    registrationDeadline: registrationDeadline !== undefined ? registrationDeadline : event.registrationDeadline,
    capacity: capacity !== undefined ? Number(capacity) : event.capacity,
    tags: tags !== undefined ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : event.tags,
    description: description !== undefined ? description : event.description,
    prize: prize !== undefined ? prize : event.prize,
    organizer: organizer !== undefined ? organizer : event.organizer
  };

  db.get('events').find({ id: req.params.id }).assign(updated).write();
  res.json(updated);
});

router.delete('/events/:id', (req, res) => {
  const event = db.get('events').find({ id: req.params.id }).value();
  if (!event) return res.status(404).json({ error: 'Event not found' });

  db.get('events').remove({ id: req.params.id }).write();
  res.json({ success: true, message: 'Event deleted' });
});

// ==========================================
// 4. ROADMAPS MANAGEMENT
// ==========================================
router.post('/roadmaps', (req, res) => {
  const { title, category, target, timeCommitment, tags, overview, modules } = req.body;
  if (!title || !overview) {
    return res.status(400).json({ error: 'Title and Overview are required' });
  }

  const newRoadmap = {
    id: `rm-${uuidv4().slice(0, 8)}`,
    title,
    category: category || 'Web Development',
    target: target || 'Beginner to Intermediate',
    timeCommitment: timeCommitment || '12 Weeks',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : ['Tech']),
    overview,
    modules: Array.isArray(modules) ? modules : []
  };

  db.get('roadmaps').push(newRoadmap).write();
  res.status(201).json(newRoadmap);
});

router.put('/roadmaps/:id', (req, res) => {
  const roadmap = db.get('roadmaps').find({ id: req.params.id }).value();
  if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });

  const { title, category, target, timeCommitment, tags, overview, modules } = req.body;

  const updated = {
    ...roadmap,
    title: title !== undefined ? title : roadmap.title,
    category: category !== undefined ? category : roadmap.category,
    target: target !== undefined ? target : roadmap.target,
    timeCommitment: timeCommitment !== undefined ? timeCommitment : roadmap.timeCommitment,
    tags: tags !== undefined ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : roadmap.tags,
    overview: overview !== undefined ? overview : roadmap.overview,
    modules: modules !== undefined ? modules : roadmap.modules
  };

  db.get('roadmaps').find({ id: req.params.id }).assign(updated).write();
  res.json(updated);
});

router.delete('/roadmaps/:id', (req, res) => {
  const roadmap = db.get('roadmaps').find({ id: req.params.id }).value();
  if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });

  db.get('roadmaps').remove({ id: req.params.id }).write();
  res.json({ success: true, message: 'Roadmap deleted' });
});

// ==========================================
// 5. QUIZZES MANAGEMENT
// ==========================================
router.post('/quizzes', (req, res) => {
  const { title, category, difficulty, timeLimit, description, questions } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and Description are required' });
  }

  const newQuiz = {
    id: `qz-${uuidv4().slice(0, 8)}`,
    title,
    category: category || 'General',
    difficulty: difficulty || 'Intermediate',
    timeLimit: Number(timeLimit) || 15,
    description,
    questions: Array.isArray(questions) ? questions : []
  };

  db.get('quizzes').push(newQuiz).write();
  res.status(201).json(newQuiz);
});

router.put('/quizzes/:id', (req, res) => {
  const quiz = db.get('quizzes').find({ id: req.params.id }).value();
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const { title, category, difficulty, timeLimit, description, questions } = req.body;

  const updated = {
    ...quiz,
    title: title !== undefined ? title : quiz.title,
    category: category !== undefined ? category : quiz.category,
    difficulty: difficulty !== undefined ? difficulty : quiz.difficulty,
    timeLimit: timeLimit !== undefined ? Number(timeLimit) : quiz.timeLimit,
    description: description !== undefined ? description : quiz.description,
    questions: questions !== undefined ? questions : quiz.questions
  };

  db.get('quizzes').find({ id: req.params.id }).assign(updated).write();
  res.json(updated);
});

router.delete('/quizzes/:id', (req, res) => {
  const quiz = db.get('quizzes').find({ id: req.params.id }).value();
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  db.get('quizzes').remove({ id: req.params.id }).write();
  res.json({ success: true, message: 'Quiz deleted' });
});

// ==========================================
// 6. FLASHCARDS & CHEATSHEETS (RESOURCES)
// ==========================================
router.post('/flashcards', (req, res) => {
  const { title, category, cards } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const newDeck = {
    id: `fc-${uuidv4().slice(0, 8)}`,
    title,
    category: category || 'Web Development',
    cards: Array.isArray(cards) ? cards : []
  };

  db.get('flashcardDecks').push(newDeck).write();
  res.status(201).json(newDeck);
});

router.put('/flashcards/:id', (req, res) => {
  const deck = db.get('flashcardDecks').find({ id: req.params.id }).value();
  if (!deck) return res.status(404).json({ error: 'Flashcard deck not found' });

  const { title, category, cards } = req.body;

  const updated = {
    ...deck,
    title: title !== undefined ? title : deck.title,
    category: category !== undefined ? category : deck.category,
    cards: cards !== undefined ? cards : deck.cards
  };

  db.get('flashcardDecks').find({ id: req.params.id }).assign(updated).write();
  res.json(updated);
});

router.delete('/flashcards/:id', (req, res) => {
  const deck = db.get('flashcardDecks').find({ id: req.params.id }).value();
  if (!deck) return res.status(404).json({ error: 'Flashcard deck not found' });

  db.get('flashcardDecks').remove({ id: req.params.id }).write();
  res.json({ success: true, message: 'Flashcard deck deleted' });
});

router.post('/cheatsheets', (req, res) => {
  const { title, category, description, tags, snippets } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const newSheet = {
    id: `cs-${uuidv4().slice(0, 8)}`,
    title,
    category: category || 'JavaScript',
    description: description || '',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
    snippets: Array.isArray(snippets) ? snippets : []
  };

  db.get('cheatsheets').push(newSheet).write();
  res.status(201).json(newSheet);
});

router.put('/cheatsheets/:id', (req, res) => {
  const sheet = db.get('cheatsheets').find({ id: req.params.id }).value();
  if (!sheet) return res.status(404).json({ error: 'Cheatsheet not found' });

  const { title, category, description, tags, snippets } = req.body;

  const updated = {
    ...sheet,
    title: title !== undefined ? title : sheet.title,
    category: category !== undefined ? category : sheet.category,
    description: description !== undefined ? description : sheet.description,
    tags: tags !== undefined ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : sheet.tags,
    snippets: snippets !== undefined ? snippets : sheet.snippets
  };

  db.get('cheatsheets').find({ id: req.params.id }).assign(updated).write();
  res.json(updated);
});

router.delete('/cheatsheets/:id', (req, res) => {
  const sheet = db.get('cheatsheets').find({ id: req.params.id }).value();
  if (!sheet) return res.status(404).json({ error: 'Cheatsheet not found' });

  db.get('cheatsheets').remove({ id: req.params.id }).write();
  res.json({ success: true, message: 'Cheatsheet deleted' });
});

// ==========================================
// 7. TEAMS MANAGEMENT
// ==========================================
router.get('/teams', (req, res) => {
  const teams = db.read().get('teams').value() || [];
  res.json(teams);
});

router.put('/teams/:id', (req, res) => {
  const team = db.get('teams').find({ id: req.params.id }).value();
  if (!team) return res.status(404).json({ error: 'Team post not found' });

  const { title, roleNeeded, status, description } = req.body;

  const updated = {
    ...team,
    title: title !== undefined ? title : team.title,
    roleNeeded: roleNeeded !== undefined ? roleNeeded : team.roleNeeded,
    status: status !== undefined ? status : team.status,
    description: description !== undefined ? description : team.description
  };

  db.get('teams').find({ id: req.params.id }).assign(updated).write();
  res.json(updated);
});

router.delete('/teams/:id', (req, res) => {
  const team = db.get('teams').find({ id: req.params.id }).value();
  if (!team) return res.status(404).json({ error: 'Team post not found' });

  db.get('teams').remove({ id: req.params.id }).write();
  res.json({ success: true, message: 'Team post deleted' });
});

module.exports = router;
