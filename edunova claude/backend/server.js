// EduNova Server - Updated with db.read() auto-sync
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const path = require('path');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const roadmapRoutes = require('./routes/roadmaps');
const contestRoutes = require('./routes/contests');
const quizRoutes = require('./routes/quizzes');
const teamRoutes = require('./routes/teams');
const resourceRoutes = require('./routes/resources');
const focusRoutes = require('./routes/focus');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  })
);
app.use(express.json());

// Serve static assets from frontend build directory
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'edunova-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all for non-existent API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Single Page Application (SPA) fallback - serve index.html for all frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const server = app.listen(PORT, () => {
  console.log(`\n🚀 EduNova Unified Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use by a previous EduNova or Node instance.`);
    console.error(`👉 The application is ALREADY running at http://localhost:${PORT}`);
    console.error(`👉 To restart, close the existing terminal window or process using port ${PORT}.\n`);
    process.exit(1);
  } else {
    throw err;
  }
});
