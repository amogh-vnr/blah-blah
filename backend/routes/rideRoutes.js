const express = require('express');
const { 
  getRides, getRide, createRide, getMyPublishedRides, 
  deleteRide, updateRideStatus 
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getRides)
  .post(protect, createRide);

router.route('/mine')
  .get(protect, getMyPublishedRides);

router.route('/:id')
  .get(getRide)
  .delete(protect, deleteRide);

router.route('/:id/status')
  .put(protect, updateRideStatus);

module.exports = router;
