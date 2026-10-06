const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

exports.bookRide = async (req, res, next) => {
  try {
    const rideId = req.params.rideId;
    const seatsToBook = parseInt(req.body.seats) || 1;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    if (ride.seats < seatsToBook) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    if (ride.driver.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot book your own ride' });
    }

    // Decrement seats
    ride.seats -= seatsToBook;
    await ride.save();

    const booking = await Booking.create({
      ride: rideId,
      passenger: req.user.id,
      seatsBooked: seatsToBook
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ passenger: req.user.id }).populate({
      path: 'ride',
      populate: {
        path: 'driver',
        select: 'name picture'
      }
    });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};
