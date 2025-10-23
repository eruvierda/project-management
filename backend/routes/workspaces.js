import express from 'express';
const router = express.Router();
import {
  getWorkspaces,
  createWorkspace,
} from '../controllers/workspaceController.js';
import auth from '../middleware/authMiddleware.js';

// @route   GET api/workspaces
// @desc    Get all workspaces for a user
// @access  Private
router.get('/', auth, getWorkspaces);

// @route   POST api/workspaces
// @desc    Create a workspace
// @access  Private
router.post('/', auth, createWorkspace);

export default router;
