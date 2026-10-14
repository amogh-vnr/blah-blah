const Negotiation = require('../models/Negotiation');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

// Propose a price negotiation
exports.createNegotiation = async (req, res, next) => {
  try {
    const { rideId, proposedPrice, seats = 1, message = '' } = req.body;
    const passengerId = req.user.id;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    if (ride.driver.toString() === passengerId) {
      return res.status(400).json({ success: false, message: 'You cannot negotiate on your own ride' });
    }

    if (ride.seats < seats) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    if (proposedPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Proposed price must be greater than 0' });
    }

    const negotiation = await Negotiation.create({
      ride: rideId,
      passenger: passengerId,
      driver: ride.driver,
      originalPrice: ride.price,
      proposedPrice: Number(proposedPrice),
      seats: Number(seats),
      message
    });

    const populated = await Negotiation.findById(negotiation._id)
      .populate('passenger', 'name picture')
      .populate('driver', 'name picture')
      .populate('ride', 'from to date price');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// Get negotiations for current user (as driver or passenger)
exports.getMyNegotiations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const negotiations = await Negotiation.find({
      $or: [{ passenger: userId }, { driver: userId }]
    })
      .populate('passenger', 'name picture phone')
      .populate('driver', 'name picture phone')
      .populate('ride', 'from to date price seats')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: negotiations.length, data: negotiations });
  } catch (error) {
    next(error);
  }
};

// Respond to negotiation (accept, reject, counter)
exports.respondToNegotiation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, counterPrice } = req.body; // 'accept', 'reject', 'counter'
    const userId = req.user.id;

    const negotiation = await Negotiation.findById(id).populate('ride');
    if (!negotiation) {
      return res.status(404).json({ success: false, message: 'Negotiation not found' });
    }

    // Driver or passenger can respond
    const isDriver = negotiation.driver.toString() === userId;
    const isPassenger = negotiation.passenger.toString() === userId;

    if (!isDriver && !isPassenger) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (action === 'accept') {
      const agreedPrice = negotiation.status === 'countered' && isPassenger
        ? negotiation.counterPrice
        : negotiation.proposedPrice;

      // Atomically decrement seats on ride
      const updatedRide = await Ride.findOneAndUpdate(
        { _id: negotiation.ride._id, seats: { $gte: negotiation.seats } },
        { $inc: { seats: -negotiation.seats } },
        { new: true }
      );

      if (!updatedRide) {
        return res.status(400).json({ success: false, message: 'Not enough seats available anymore' });
      }

      negotiation.status = 'accepted';
      await negotiation.save();

      // Automatically create confirmed booking at agreed price!
      const booking = await Booking.create({
        ride: negotiation.ride._id,
        passenger: negotiation.passenger,
        seatsBooked: negotiation.seats,
        status: 'confirmed'
      });

      return res.status(200).json({
        success: true,
        message: `Negotiation accepted at ₹${agreedPrice}/seat! Booking confirmed.`,
        data: negotiation,
        booking
      });
    }

    if (action === 'reject') {
      negotiation.status = 'rejected';
      await negotiation.save();
      return res.status(200).json({ success: true, message: 'Negotiation declined', data: negotiation });
    }

    if (action === 'counter') {
      if (!counterPrice || counterPrice <= 0) {
        return res.status(400).json({ success: false, message: 'Please provide a valid counter price' });
      }
      negotiation.status = 'countered';
      negotiation.counterPrice = Number(counterPrice);
      await negotiation.save();
      return res.status(200).json({ success: true, message: 'Counter offer sent', data: negotiation });
    }

    res.status(400).json({ success: false, message: 'Invalid action' });
  } catch (error) {
    next(error);
  }
};
