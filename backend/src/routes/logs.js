import express from 'express';
import {
  getEventLogs,
  getAllEventLogs
} from '../controllers/logController.js';

const router = express.Router();

// GET /api/events/:id/logs - Get logs for a specific event
router.get('/events/:id/logs', getEventLogs);

// GET /api/logs - Get all event logs (admin function)
router.get('/', getAllEventLogs);

export default router;
