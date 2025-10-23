import express from 'express';
const router = express.Router();
import { registerUser } from '../controllers/userController.js';

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', registerUser);

export default router;
