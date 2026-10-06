const express = require('express');
const { bookRide, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getMyBookings);

router.route('/:rideId')
  .post(protect, bookRide);

module.exports = router;
