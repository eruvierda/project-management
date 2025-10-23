import express from 'express';
const router = express.Router();
import {
  getProjectsByWorkspace,
  createProject,
} from '../controllers/projectController.js';
import auth from '../middleware/authMiddleware.js';

// @route   GET /api/projects/by-workspace/:workspaceId
// @desc    Get all projects for a workspace
// @access  Private
router.get('/by-workspace/:workspaceId', auth, getProjectsByWorkspace);

// @route   POST /api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, createProject);

export default router;
