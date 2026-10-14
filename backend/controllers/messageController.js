const Message = require('../models/Message');
const Ride = require('../models/Ride');

exports.sendMessage = async (req, res, next) => {
  try {
    const { rideId, recipientId, text, quickAction } = req.body;
    const senderId = req.user.id;

    if (!text && !quickAction) {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
    }

    if (!recipientId) {
      return res.status(400).json({ success: false, message: 'Recipient is required' });
    }

    if (!rideId) {
      return res.status(400).json({ success: false, message: 'Ride ID is required' });
    }

    const message = await Message.create({
      ride: rideId,
      sender: senderId,
      recipient: recipientId,
      text: text || quickAction,
      quickAction: quickAction || ''
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name picture')
      .populate('recipient', 'name picture');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.getRideMessages = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({
      ride: rideId,
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'name picture')
      .populate('recipient', 'name picture')
      .sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { ride: rideId, recipient: userId, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

exports.getMyConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'name picture phone')
      .populate('recipient', 'name picture phone')
      .populate('ride', 'from to date vehicle')
      .sort({ createdAt: -1 });

    // Group messages by ride and other user
    const conversationMap = new Map();

    for (const msg of messages) {
      if (!msg.ride || !msg.sender || !msg.recipient) continue;
      const otherUser = msg.sender._id.toString() === userId ? msg.recipient : msg.sender;
      const key = `${msg.ride._id}_${otherUser._id}`;

      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          ride: msg.ride,
          otherUser,
          lastMessage: msg,
          unreadCount: (msg.recipient._id.toString() === userId && !msg.read) ? 1 : 0
        });
      } else if (msg.recipient._id.toString() === userId && !msg.read) {
        conversationMap.get(key).unreadCount += 1;
      }
    }

    res.status(200).json({
      success: true,
      data: Array.from(conversationMap.values())
    });
  } catch (error) {
    next(error);
  }
};
