import express from 'express';
import { refreshToken, auth, firebaseAuth } from '../controllers/auth.js';

const router = express.Router();

router.post('/refresh-token', refreshToken);
router.post('/signin', auth);
router.post('/firebase-signin', firebaseAuth);

export default router;
