import express from 'express';
const router = express.Router();
import {
  getCommentsByTask,
  createComment,
} from '../controllers/commentController.js';
import auth from '../middleware/authMiddleware.js';

// @route   GET /api/comments/by-task/:taskId
// @desc    Get all comments for a task
// @access  Private
router.get('/by-task/:taskId', auth, getCommentsByTask);

// @route   POST /api/comments
// @desc    Create a comment on a task
// @access  Private
router.post('/', auth, createComment);

export default router;
