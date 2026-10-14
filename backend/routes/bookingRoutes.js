const express = require('express');
const { bookRide, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getMyBookings);

router.route('/:rideId')
  .post(protect, bookRide);

router.route('/:id/cancel')
  .put(protect, cancelBooking)
  .delete(protect, cancelBooking);

module.exports = router;
