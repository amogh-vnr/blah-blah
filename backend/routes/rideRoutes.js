const express = require('express');
const { getRides, getRide, createRide, getMyPublishedRides, deleteRide } = require('../controllers/rideController');
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

module.exports = router;
