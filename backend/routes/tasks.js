import express from 'express';
const router = express.Router();
import {
  getTasksByProject,
  createTask,
} from '../controllers/taskController.js';
import auth from '../middleware/authMiddleware.js';

// @route   GET /api/tasks/by-project/:projectId
// @desc    Get all tasks for a project
// @access  Private
router.get('/by-project/:projectId', auth, getTasksByProject);

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, createTask);

export default router;
