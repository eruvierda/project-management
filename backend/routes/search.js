import express from 'express';
const router = express.Router();
import { searchAll } from '../controllers/searchController.js';
import auth from '../middleware/authMiddleware.js';

// @route   GET /api/search
// @desc    Search across projects, tasks, and comments
// @access  Private
router.get('/', auth, searchAll);

export default router;
