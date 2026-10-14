const express = require('express');
const { createNegotiation, getMyNegotiations, respondToNegotiation } = require('../controllers/negotiationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createNegotiation)
  .get(getMyNegotiations);

router.route('/:id/respond')
  .put(respondToNegotiation);

module.exports = router;
