const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, college } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }

  const existing = db.get('users').find({ email: email.toLowerCase() }).value();
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const userRole = req.body.role || 'user';
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email: email.toLowerCase(),
    college: college || null,
    role: userRole,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  db.get('users').push(user).write();

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, college: user.college, role: user.role }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = db.get('users').find({ email: email.toLowerCase() }).value();
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const role = user.role || 'user';
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, college: user.college, role }
  });
});

router.get('/me', requireAuth, (req, res) => {
  const user = db.get('users').find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, college: user.college, role: user.role || 'user' });
});

// POST /api/auth/admin-login - Dedicated login for Admin Panel
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Auto-seed default admin account if logging in with admin@edunova.com
  let user = db.get('users').find({ email: cleanEmail }).value();
  if (!user && cleanEmail === 'admin@edunova.com' && password === 'admin123') {
    const passwordHash = await bcrypt.hash('admin123', 10);
    user = {
      id: uuidv4(),
      name: 'System Administrator',
      email: 'admin@edunova.com',
      college: 'EduNova HQ',
      role: 'admin',
      passwordHash,
      createdAt: new Date().toISOString()
    };
    db.get('users').push(user).write();
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Account does not have Administrator privileges' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, college: user.college, role: user.role }
  });
});

// Endpoint for current logged-in user to toggle their role (if needed)
router.post('/toggle-admin', requireAuth, (req, res) => {
  const user = db.get('users').find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ error: 'User not found' });

  const newRole = user.role === 'admin' ? 'user' : 'admin';
  db.get('users').find({ id: req.user.id }).assign({ role: newRole }).write();

  const updatedUser = { id: user.id, name: user.name, email: user.email, college: user.college, role: newRole };
  const token = jwt.sign(
    { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: updatedUser });
});

module.exports = router;
