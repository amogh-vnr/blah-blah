const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

exports.getRides = async (req, res, next) => {
  try {
    const { 
      from, to, date, seats, 
      ladiesOnly, petsAllowed, acEnabled, luggageSize, chattyLevel 
    } = req.query;

    let query = {};
    
    // Only show future rides
    query.date = { $gte: new Date() };

    if (from) query.from = { $regex: from.trim(), $options: 'i' };
    if (to) query.to = { $regex: to.trim(), $options: 'i' };
    if (seats) query.seats = { $gte: parseInt(seats) };
    
    // Advanced Filters
    if (ladiesOnly === 'true') query.ladiesOnly = true;
    if (petsAllowed === 'true') query.petsAllowed = true;
    if (acEnabled === 'true') query.acEnabled = true;
    if (luggageSize) query.luggageSize = luggageSize;
    if (chattyLevel) query.chattyLevel = chattyLevel;

    if (date) {
      const searchDate = new Date(date);
      query.date = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999))
      };
      if (query.date.$gte < new Date()) {
        query.date.$gte = new Date();
      }
    }

    const rides = await Ride.find(query)
      .populate('driver', 'name picture bio phone')
      .sort({ date: 1 });

    res.status(200).json({ success: true, count: rides.length, data: rides });
  } catch (error) {
    next(error);
  }
};

exports.getRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver', 'name picture bio phone');
    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });
    res.status(200).json({ success: true, data: ride });
  } catch (error) {
    next(error);
  }
};

exports.createRide = async (req, res, next) => {
  try {
    // Validate future date
    if (new Date(req.body.date) <= new Date()) {
      return res.status(400).json({ success: false, message: 'Ride date must be in the future' });
    }

    // Validate from !== to
    if (req.body.from && req.body.to && req.body.from.toLowerCase().trim() === req.body.to.toLowerCase().trim()) {
      return res.status(400).json({ success: false, message: 'Departure and destination cannot be the same' });
    }

    // Validate price
    if (req.body.price && req.body.price <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be greater than 0' });
    }

    req.body.driver = req.user.id;
    const ride = await Ride.create(req.body);
    const populatedRide = await Ride.findById(ride._id).populate('driver', 'name picture bio phone');
    res.status(201).json({ success: true, data: populatedRide });
  } catch (error) {
    next(error);
  }
};

exports.getMyPublishedRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({ driver: req.user.id })
      .populate('driver', 'name picture phone')
      .sort({ date: -1 });
    res.status(200).json({ success: true, count: rides.length, data: rides });
  } catch (error) {
    next(error);
  }
};

exports.updateRideStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the driver can update trip status' });
    }

    ride.status = status;
    await ride.save();

    res.status(200).json({ success: true, message: `Ride status updated to ${status}`, data: ride });
  } catch (error) {
    next(error);
  }
};

exports.deleteRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this ride' });
    }

    await Ride.findByIdAndDelete(req.params.id);
    await Booking.updateMany({ ride: req.params.id }, { status: 'cancelled' });

    res.status(200).json({ success: true, message: 'Ride deleted successfully' });
  } catch (error) {
    next(error);
  }
};
