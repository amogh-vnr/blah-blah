const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory array to simulate DB for simplicity and immediate feedback,
// though mongoose is installed if a real Mongo URI is provided.
const rides = [
  {
    _id: "1",
    from: "Paris",
    to: "Lyon",
    date: new Date(Date.now() + 86400000).toISOString(),
    price: 35,
    driver: "Alice",
    seats: 3
  },
  {
    _id: "2",
    from: "London",
    to: "Manchester",
    date: new Date(Date.now() + 172800000).toISOString(),
    price: 25,
    driver: "Bob",
    seats: 2
  }
];

// Routes
app.get('/api/rides', (req, res) => {
  const { from, to, date, seats } = req.query;
  
  let filteredRides = rides;
  
  if (from) {
    filteredRides = filteredRides.filter(r => r.from.toLowerCase().includes(from.toLowerCase()));
  }
  if (to) {
    filteredRides = filteredRides.filter(r => r.to.toLowerCase().includes(to.toLowerCase()));
  }
  if (seats) {
    filteredRides = filteredRides.filter(r => r.seats >= parseInt(seats));
  }
  
  res.json(filteredRides);
});

app.post('/api/rides', (req, res) => {
  const newRide = {
    _id: String(rides.length + 1),
    ...req.body
  };
  rides.push(newRide);
  res.status(201).json(newRide);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
