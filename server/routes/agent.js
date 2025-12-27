import express from 'express';
import {
  chatWithAgent,
  initAgent,
  autoKycProcessing,
  getAgentSuggestions,
} from '../controllers/agent.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/chat', adminAuth, chatWithAgent);
router.post('/init', adminAuth, initAgent);
router.post('/auto-kyc', adminAuth, autoKycProcessing);
router.get('/suggestions', adminAuth, getAgentSuggestions);

export default router;

