import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', verifyToken, getUserProfile);

export default router; 