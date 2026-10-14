const RideRequest = require('../models/RideRequest');

exports.createRequest = async (req, res, next) => {
  try {
    const { from, to, date, seats = 1, maxBudget, notes } = req.body;
    const passenger = req.user.id;

    if (!from || !to || !date || !maxBudget) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    const request = await RideRequest.create({
      passenger,
      from: from.trim(),
      to: to.trim(),
      date: new Date(date),
      seats: Number(seats),
      maxBudget: Number(maxBudget),
      notes: notes || ''
    });

    const populated = await RideRequest.findById(request._id).populate('passenger', 'name picture phone');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.getAllRequests = async (req, res, next) => {
  try {
    const requests = await RideRequest.find({
      status: 'open',
      date: { $gte: new Date() }
    })
      .populate('passenger', 'name picture phone')
      .sort({ date: 1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await RideRequest.find({ passenger: req.user.id })
      .populate('passenger', 'name picture')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.cancelRequest = async (req, res, next) => {
  try {
    const request = await RideRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    if (request.passenger.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    request.status = 'cancelled';
    await request.save();
    res.status(200).json({ success: true, message: 'Request cancelled successfully', data: request });
  } catch (error) {
    next(error);
  }
};
