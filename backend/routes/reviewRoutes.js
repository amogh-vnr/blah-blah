const express = require('express');
const { createReview, getUserReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.route('/user/:userId')
  .get(getUserReviews);

module.exports = router;
