import express from 'express';
const router = express.Router();
import { registerUser, loginUser } from '../controllers/userController.js';

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

export default router;
