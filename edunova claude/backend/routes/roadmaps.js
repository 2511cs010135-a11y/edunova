const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/roadmaps - list all roadmaps
router.get('/', (req, res) => {
  res.json(db.read().get('roadmaps').value());
});

// GET /api/roadmaps/:id
router.get('/:id', (req, res) => {
  const roadmap = db.get('roadmaps').find({ id: req.params.id }).value();
  if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
  res.json(roadmap);
});

// GET /api/roadmaps/:id/progress - current user's checked items for this roadmap
router.get('/:id/progress', requireAuth, (req, res) => {
  const record = db
    .get('progress')
    .find({ roadmapId: req.params.id, userId: req.user.id })
    .value();
  res.json({ completedItems: record ? record.completedItems : [] });
});

// PUT /api/roadmaps/:id/progress - replace the set of completed item labels
router.put('/:id/progress', requireAuth, (req, res) => {
  const roadmap = db.get('roadmaps').find({ id: req.params.id }).value();
  if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });

  const { completedItems } = req.body;
  if (!Array.isArray(completedItems)) {
    return res.status(400).json({ error: 'completedItems must be an array of strings' });
  }

  const existing = db
    .get('progress')
    .find({ roadmapId: req.params.id, userId: req.user.id })
    .value();

  if (existing) {
    db.get('progress')
      .find({ roadmapId: req.params.id, userId: req.user.id })
      .assign({ completedItems, updatedAt: new Date().toISOString() })
      .write();
  } else {
    db.get('progress')
      .push({
        roadmapId: req.params.id,
        userId: req.user.id,
        completedItems,
        updatedAt: new Date().toISOString()
      })
      .write();
  }

  res.json({ completedItems });
});

module.exports = router;
