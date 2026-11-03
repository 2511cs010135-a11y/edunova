const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/focus/logs - user's focus logs & analytics summary
router.get('/logs', requireAuth, (req, res) => {
  const logs = db.get('focusLogs').filter({ userId: req.user.id }).value() || [];
  
  const totalMinutes = logs.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  
  res.json({
    totalMinutes,
    totalSessions: logs.length,
    logs: logs.reverse() // Most recent first
  });
});

// POST /api/focus/logs - log a completed focus session
router.post('/logs', requireAuth, (req, res) => {
  const { durationMinutes, topic, mode } = req.body;

  if (!durationMinutes || durationMinutes <= 0) {
    return res.status(400).json({ error: 'Valid session duration is required' });
  }

  const logEntry = {
    id: uuidv4(),
    userId: req.user.id,
    durationMinutes: Number(durationMinutes),
    topic: topic || 'General Study',
    mode: mode || 'Pomodoro',
    timestamp: new Date().toISOString()
  };

  db.get('focusLogs').push(logEntry).write();
  res.status(201).json(logEntry);
});

module.exports = router;
