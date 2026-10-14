const mongoose = require('mongoose');

const negotiationSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalPrice: { type: Number, required: true },
  proposedPrice: { type: Number, required: true },
  seats: { type: Number, default: 1 },
  counterPrice: { type: Number },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'countered'], 
    default: 'pending' 
  },
  message: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Negotiation', negotiationSchema);
