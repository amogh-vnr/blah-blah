const express = require('express');
const { createRequest, getAllRequests, getMyRequests, cancelRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getAllRequests)
  .post(protect, createRequest);

router.route('/mine')
  .get(protect, getMyRequests);

router.route('/:id/cancel')
  .put(protect, cancelRequest);

module.exports = router;
