const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  seats: { type: Number, default: 1 },
  maxBudget: { type: Number, required: true },
  notes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['open', 'fulfilled', 'cancelled'], 
    default: 'open' 
  }
}, { timestamps: true });

module.exports = mongoose.model('RideRequest', rideRequestSchema);
