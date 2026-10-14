const express = require('express');
const { sendMessage, getRideMessages, getMyConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(sendMessage);

router.route('/conversations')
  .get(getMyConversations);

router.route('/ride/:rideId')
  .get(getRideMessages);

module.exports = router;
