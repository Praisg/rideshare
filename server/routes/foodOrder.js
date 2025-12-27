import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  restaurantAcceptOrder,
  restaurantRejectOrder,
  markReady,
  placeBid,
  acceptBid,
  markPickedUp,
  markInTransit,
  markDelivered,
  cancelOrder,
  rateOrder,
  getAvailableDeliveries,
  getCourierActiveDelivery,
  getRestaurantOrders,
  updateCourierLocation,
} from '../controllers/foodOrder.js';

const router = express.Router();

router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.post('/create', createOrder);
router.get('/', getOrders);
router.get('/available-deliveries', getAvailableDeliveries);
router.get('/active-delivery', getCourierActiveDelivery);
router.get('/restaurant/:restaurantId', getRestaurantOrders);
router.get('/:id', getOrderById);

router.patch('/:id/restaurant-accept', restaurantAcceptOrder);
router.patch('/:id/restaurant-reject', restaurantRejectOrder);
router.patch('/:id/ready', markReady);

router.post('/:id/bid', placeBid);
router.patch('/:id/accept-bid', acceptBid);

router.patch('/:id/pickup', markPickedUp);
router.patch('/:id/in-transit', markInTransit);
router.patch('/:id/deliver', markDelivered);
router.patch('/:id/cancel', cancelOrder);

router.post('/:id/rate', rateOrder);
router.post('/:id/courier-location', updateCourierLocation);

export default router;

