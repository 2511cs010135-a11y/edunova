const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/events - list all events (optionally filter by type)
router.get('/', (req, res) => {
  const { type } = req.query;
  let events = db.get('events').value();
  if (type) {
    events = events.filter((e) => e.type === type);
  }

  const regs = db.get('registrations').value();
  const withCounts = events.map((e) => ({
    ...e,
    registeredCount: regs.filter((r) => r.eventId === e.id).length
  }));

  res.json(withCounts);
});

// GET /api/events/:id
router.get('/:id', (req, res) => {
  const event = db.get('events').find({ id: req.params.id }).value();
  if (!event) return res.status(404).json({ error: 'Event not found' });
  const registeredCount = db.get('registrations').filter({ eventId: event.id }).size().value();
  res.json({ ...event, registeredCount });
});

// POST /api/events/:id/register - register the logged-in user for an event
router.post('/:id/register', requireAuth, (req, res) => {
  const event = db.get('events').find({ id: req.params.id }).value();
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const already = db
    .get('registrations')
    .find({ eventId: event.id, userId: req.user.id })
    .value();
  if (already) {
    return res.status(409).json({ error: 'You are already registered for this event' });
  }

  const registeredCount = db.get('registrations').filter({ eventId: event.id }).size().value();
  if (registeredCount >= event.capacity) {
    return res.status(400).json({ error: 'This event is full' });
  }

  if (new Date(event.registrationDeadline) < new Date()) {
    return res.status(400).json({ error: 'Registration for this event has closed' });
  }

  const { teamName, notes } = req.body;
  const registration = {
    id: uuidv4(),
    eventId: event.id,
    userId: req.user.id,
    teamName: teamName || null,
    notes: notes || null,
    registeredAt: new Date().toISOString()
  };

  db.get('registrations').push(registration).write();
  res.status(201).json(registration);
});

// DELETE /api/events/:id/register - cancel registration
router.delete('/:id/register', requireAuth, (req, res) => {
  const registration = db
    .get('registrations')
    .find({ eventId: req.params.id, userId: req.user.id })
    .value();
  if (!registration) return res.status(404).json({ error: 'Registration not found' });

  db.get('registrations').remove({ id: registration.id }).write();
  res.json({ success: true });
});

// GET /api/events/mine/registrations - all events the current user registered for
router.get('/mine/registrations', requireAuth, (req, res) => {
  const regs = db.get('registrations').filter({ userId: req.user.id }).value();
  const events = db.get('events').value();
  const result = regs.map((r) => ({
    ...r,
    event: events.find((e) => e.id === r.eventId) || null
  }));
  res.json(result);
});

module.exports = router;
