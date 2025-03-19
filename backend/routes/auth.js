import express from 'express';
import { register, login, getUserProfile } from '../controllers/auth.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/profile
// @desc    Get logged in user profile
// @access  Private
router.get('/profile', getUserProfile);

export default router;
