import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  searchRestaurants,
  createRestaurant,
  updateRestaurant,
  toggleRestaurantStatus,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCuisines,
} from '../controllers/restaurant.js';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/search', searchRestaurants);
router.get('/cuisines', getCuisines);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);

router.post('/create', createRestaurant);
router.patch('/:id', updateRestaurant);
router.patch('/:id/toggle-status', toggleRestaurantStatus);

router.post('/:id/menu/item', addMenuItem);
router.patch('/:id/menu/item/:itemId', updateMenuItem);
router.delete('/:id/menu/item/:itemId', deleteMenuItem);

export default router;

