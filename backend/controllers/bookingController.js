const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

exports.bookRide = async (req, res, next) => {
  try {
    const rideId = req.params.rideId;
    const seatsToBook = parseInt(req.body.seats) || 1;

    if (seatsToBook < 1) {
      return res.status(400).json({ success: false, message: 'You must book at least 1 seat' });
    }

    // Check ride exists first for better error messages
    const rideCheck = await Ride.findById(rideId);
    if (!rideCheck) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    if (rideCheck.driver.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot book your own ride' });
    }

    if (new Date(rideCheck.date) < new Date()) {
      return res.status(400).json({ success: false, message: 'This ride has already departed' });
    }

    // Atomic seat decrement — prevents race conditions
    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, seats: { $gte: seatsToBook } },
      { $inc: { seats: -seatsToBook } },
      { new: true }
    );

    if (!ride) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    const booking = await Booking.create({
      ride: rideId,
      passenger: req.user.id,
      seatsBooked: seatsToBook,
      status: 'confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'ride',
      populate: {
        path: 'driver',
        select: 'name picture phone bio'
      }
    });

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ passenger: req.user.id })
      .populate({
        path: 'ride',
        populate: {
          path: 'driver',
          select: 'name picture phone bio'
        }
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.passenger.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Atomically restore seats on the ride
    await Ride.findByIdAndUpdate(booking.ride, {
      $inc: { seats: booking.seatsBooked }
    });

    res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    next(error);
  }
};
