import express from 'express';
import { submitKYC, getKYCStatus, approveKYC, rejectKYC, getRiderEarnings } from '../controllers/kyc.js';
import auth from '../middleware/authentication.js';

const router = express.Router();

router.post('/submit', auth, submitKYC);
router.get('/status', auth, getKYCStatus);
router.post('/approve', auth, approveKYC);
router.post('/reject', auth, rejectKYC);
router.get('/earnings', auth, getRiderEarnings);

export default router;
