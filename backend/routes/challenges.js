import express from 'express';
import { 
  getAllChallenges,
  getChallenge,
  startChallenge,
  completeStep,
  abandonChallenge,
  getCategories,
  getChallengeProgress
} from '../controllers/challenges.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes should be protected
router.use(protect);

router.get('/', getAllChallenges);
router.get('/categories', getCategories);
router.get('/progress', getChallengeProgress);
router.get('/:id', getChallenge);
router.post('/:id/start', startChallenge);
router.post('/:id/steps/:stepId/complete', completeStep);
router.delete('/:id/abandon', abandonChallenge);

export default router;
