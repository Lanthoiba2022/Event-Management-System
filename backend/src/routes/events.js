import express from 'express';
import {
  getEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

const router = express.Router();

// GET /api/events - Get all events (with optional profile filter)
router.get('/', getEvents);

// POST /api/events - Create a new event
router.post('/', createEvent);

// GET /api/events/:id - Get a single event
router.get('/:id', getEvent);

// PUT /api/events/:id - Update an event
router.put('/:id', updateEvent);

// DELETE /api/events/:id - Delete an event
router.delete('/:id', deleteEvent);

export default router;
