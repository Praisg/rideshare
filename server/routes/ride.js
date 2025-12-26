import express from 'express';
import { 
  createRide, 
  updateRideStatus, 
  acceptRide, 
  getMyRides,
  submitOffer,
  acceptOffer,
  getRideOffers
} from '../controllers/ride.js';

const router = express.Router();

router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.post('/create', createRide);
router.patch('/accept/:rideId', acceptRide);
router.patch('/update/:rideId', updateRideStatus);
router.get('/rides', getMyRides);

router.post('/offer/:rideId', submitOffer);
router.patch('/offer/:rideId/:offerId/accept', acceptOffer);
router.get('/offers/:rideId', getRideOffers);

export default router;
