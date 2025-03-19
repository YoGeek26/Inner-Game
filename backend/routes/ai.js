import express from 'express';
import { 
  chat, 
  simulateConversation,
  analyzeConversation,
  getDetailedAnalysis,
  generateChallenges,
  getDailyChallenge,
  getConversationAdvice
} from '../controllers/ai.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/chat', chat);
router.post('/simulate', simulateConversation);
router.post('/analyze', analyzeConversation);
router.post('/analyze/detailed', getDetailedAnalysis);
router.post('/advice', getConversationAdvice);

// Protected routes
router.post('/challenges/generate', protect, generateChallenges);
router.get('/challenges/daily', protect, getDailyChallenge);

export default router;
