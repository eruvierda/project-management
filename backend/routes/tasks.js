import express from 'express';
const router = express.Router();
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
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

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, deleteTask);

export default router;
