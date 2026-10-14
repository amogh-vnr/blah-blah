const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  seats: { type: Number, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: String, default: 'Standard Passenger Car' },
  vehicleColor: { type: String, default: 'White' },
  ladiesOnly: { type: Boolean, default: false },
  chattyLevel: { type: String, enum: ['Bla', 'BlaBla', 'BlaBlaBla'], default: 'BlaBla' },
  luggageSize: { type: String, enum: ['Small', 'Medium', 'Large'], default: 'Medium' },
  petsAllowed: { type: Boolean, default: false },
  smokingAllowed: { type: Boolean, default: false },
  acEnabled: { type: Boolean, default: true },
  status: { type: String, enum: ['scheduled', 'en_route', 'arrived', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
