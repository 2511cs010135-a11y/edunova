const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/teams - list open team posts
router.get('/', (req, res) => {
  const { eventId, skill, search } = req.query;
  let teams = db.get('teams').value() || [];

  if (eventId && eventId !== 'All') {
    teams = teams.filter((t) => t.eventId === eventId);
  }

  if (skill) {
    const s = skill.toLowerCase();
    teams = teams.filter(
      (t) =>
        (t.skills && t.skills.some((sk) => sk.toLowerCase().includes(s))) ||
        (t.roleNeeded && t.roleNeeded.toLowerCase().includes(s))
    );
  }

  if (search) {
    const q = search.toLowerCase();
    teams = teams.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.eventTitle && t.eventTitle.toLowerCase().includes(q))
    );
  }

  res.json(teams);
});

// GET /api/teams/mine/posts - current user's team posts
router.get('/mine/posts', requireAuth, (req, res) => {
  const posts = db.get('teams').filter({ userId: req.user.id }).value() || [];
  res.json(posts);
});

// POST /api/teams - create team opening
router.post('/', requireAuth, (req, res) => {
  const { title, eventId, roleNeeded, skills, description, contact } = req.body;

  if (!title || !roleNeeded || !description || !contact) {
    return res.status(400).json({ error: 'Title, role needed, description, and contact info are required' });
  }

  let eventTitle = 'General Project / Hackathon';
  if (eventId) {
    const event = db.get('events').find({ id: eventId }).value();
    if (event) eventTitle = event.title;
  }

  const teamPost = {
    id: uuidv4(),
    title,
    eventId: eventId || null,
    eventTitle,
    roleNeeded,
    skills: Array.isArray(skills) ? skills : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
    description,
    contact,
    userId: req.user.id,
    userName: req.user.name,
    status: 'Open',
    createdAt: new Date().toISOString(),
    applicants: []
  };

  db.get('teams').unshift(teamPost).write();
  res.status(201).json(teamPost);
});

// POST /api/teams/:id/apply - apply to a team post
router.post('/:id/apply', requireAuth, (req, res) => {
  const team = db.get('teams').find({ id: req.params.id }).value();
  if (!team) return res.status(404).json({ error: 'Team post not found' });

  const { message, contactInfo } = req.body;
  const application = {
    id: uuidv4(),
    applicantId: req.user.id,
    applicantName: req.user.name,
    applicantEmail: req.user.email,
    message: message || '',
    contactInfo: contactInfo || req.user.email,
    appliedAt: new Date().toISOString()
  };

  const applicants = team.applicants || [];
  const updatedApplicants = [...applicants, application];

  db.get('teams')
    .find({ id: req.params.id })
    .assign({ applicants: updatedApplicants })
    .write();

  res.status(201).json({ success: true, application });
});

// DELETE /api/teams/:id - delete own team post
router.delete('/:id', requireAuth, (req, res) => {
  const team = db.get('teams').find({ id: req.params.id }).value();
  if (!team) return res.status(404).json({ error: 'Team post not found' });

  if (team.userId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to delete this post' });
  }

  db.get('teams').remove({ id: req.params.id }).write();
  res.json({ success: true });
});

module.exports = router;
