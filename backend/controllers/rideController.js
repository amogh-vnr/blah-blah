const Ride = require('../models/Ride');

exports.getRides = async (req, res, next) => {
  try {
    const { from, to, date, seats } = req.query;
    let query = {};
    
    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };
    if (seats) query.seats = { $gte: parseInt(seats) };
    if (date) {
      const searchDate = new Date(date);
      query.date = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    const rides = await Ride.find(query).populate('driver', 'name picture');
    res.status(200).json({ success: true, count: rides.length, data: rides });
  } catch (error) {
    next(error);
  }
};

exports.getRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver', 'name picture bio');
    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });
    res.status(200).json({ success: true, data: ride });
  } catch (error) {
    next(error);
  }
};

exports.createRide = async (req, res, next) => {
  try {
    req.body.driver = req.user.id;
    const ride = await Ride.create(req.body);
    res.status(201).json({ success: true, data: ride });
  } catch (error) {
    next(error);
  }
};
