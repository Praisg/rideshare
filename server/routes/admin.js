import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  getAllRides,
  getKYCSubmissions,
  getFinancials,
} from '../controllers/admin.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/login', adminLogin);

router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/users', adminAuth, getAllUsers);
router.get('/rides', adminAuth, getAllRides);
router.get('/kyc', adminAuth, getKYCSubmissions);
router.get('/financials', adminAuth, getFinancials);

export default router;

