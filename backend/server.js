const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); // using jsonwebtoken to decode for prototype

// Models
const User = require('./models/User');
const Ride = require('./models/Ride');
const Booking = require('./models/Booking');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blahblahcar';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
    // For a real production app, verify the token using google-auth-library or your own JWT secret
    // For this prototype, we'll decode the token and find/create the user
    const decoded = jwt.decode(token);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });
    
    let user = await User.findOne({ googleId: decoded.sub });
    if (!user) {
      user = await User.create({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Routes

// Auth Route
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const decoded = jwt.decode(credential);
    let user = await User.findOne({ googleId: decoded.sub });
    if (!user) {
      user = await User.create({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });
    }
    // Return token and user info
    res.json({ token: credential, user });
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating' });
  }
});

// Get Rides
app.get('/api/rides', async (req, res) => {
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

  try {
    const rides = await Ride.find(query).populate('driver', 'name picture');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rides' });
  }
});

// Create Ride
app.post('/api/rides', authMiddleware, async (req, res) => {
  try {
    const newRide = new Ride({
      ...req.body,
      driver: req.user._id
    });
    await newRide.save();
    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ride' });
  }
});

// Book Ride
app.post('/api/rides/:id/book', authMiddleware, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    const seatsToBook = req.body.seats || 1;
    
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.seats < seatsToBook) return res.status(400).json({ message: 'Not enough seats available' });
    if (ride.driver.toString() === req.user._id.toString()) return res.status(400).json({ message: 'Cannot book your own ride' });

    // Decrease available seats
    ride.seats -= seatsToBook;
    await ride.save();

    // Create booking
    const booking = new Booking({
      ride: ride._id,
      passenger: req.user._id,
      seatsBooked: seatsToBook
    });
    await booking.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error booking ride' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
