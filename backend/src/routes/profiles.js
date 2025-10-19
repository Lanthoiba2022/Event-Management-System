import express from 'express';
import {
  getProfiles,
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profileController.js';

const router = express.Router();

// GET /api/profiles - Get all profiles
router.get('/', getProfiles);

// POST /api/profiles - Create a new profile
router.post('/', createProfile);

// GET /api/profiles/:id - Get a single profile
router.get('/:id', getProfile);

// PUT /api/profiles/:id - Update a profile
router.put('/:id', updateProfile);

// DELETE /api/profiles/:id - Delete a profile
router.delete('/:id', deleteProfile);

export default router;
