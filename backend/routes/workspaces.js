import express from 'express';
const router = express.Router();
import {
  getWorkspaces,
  createWorkspace,
  addWorkspaceMember,
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

// @route   POST /api/workspaces/:id/members
// @desc    Add a member to a workspace
// @access  Private
router.post('/:id/members', auth, addWorkspaceMember);

export default router;
