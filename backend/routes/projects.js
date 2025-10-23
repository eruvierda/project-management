import express from 'express';
const router = express.Router();
import {
  getProjectsByWorkspace,
  createProject,
  updateProject,
  deleteProject,
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

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, deleteProject);

export default router;
