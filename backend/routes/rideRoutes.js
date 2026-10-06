const express = require('express');
const { getRides, getRide, createRide } = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getRides)
  .post(protect, createRide);

router.route('/:id')
  .get(getRide);

module.exports = router;
