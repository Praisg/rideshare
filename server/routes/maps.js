import express from 'express';
import {
  reverseGeocodeLocation,
  getAutocompleteSuggestions,
  getLocationDetails,
} from '../controllers/maps.js';

const router = express.Router();

router.get('/reverse-geocode', reverseGeocodeLocation);
router.get('/autocomplete', getAutocompleteSuggestions);
router.get('/place-details', getLocationDetails);

export default router;

