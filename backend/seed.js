const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Ride = require('./models/Ride');
const Booking = require('./models/Booking');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blahblahcar';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Booking.deleteMany({});
    await Ride.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing collections.');

    // Create realistic drivers
    const driversData = [
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'password123',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98765 43210',
        bio: 'Tech lead commuting between Mumbai and Pune weekly. Safe driver, non-smoker, air-conditioned car.'
      },
      {
        name: 'Pooja Verma',
        email: 'pooja@example.com',
        password: 'password123',
        picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98234 56789',
        bio: 'Product manager travelling for weekend getaways. Love good conversations and 90s music.'
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password: 'password123',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '+91 97123 45678',
        bio: 'Architect, passionate about road trips. Maruti Ertiga with plenty of luggage space.'
      },
      {
        name: 'Sneha Deshmukh',
        email: 'sneha@example.com',
        password: 'password123',
        picture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98450 12345',
        bio: 'Regular commuter on Bengaluru - Mysuru expressway. Punctual, verified profile, AC on always.'
      },
      {
        name: 'Vikram Malhotra',
        email: 'vikram@example.com',
        password: 'password123',
        picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        phone: '+91 99887 76655',
        bio: 'Consultant visiting Delhi-Chandigarh route twice a week. Sedan comfort, max 2 in rear seat.'
      }
    ];

    const createdDrivers = [];
    for (const d of driversData) {
      const user = await User.create(d);
      createdDrivers.push(user);
    }
    console.log(`Created ${createdDrivers.length} verified drivers.`);

    // Helper to get future dates
    const now = new Date();
    const getDate = (daysAhead, hours, minutes = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() + daysAhead);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const ridesData = [
      // Mumbai -> Pune (multiple departures today, tomorrow, day after)
      {
        from: 'Mumbai',
        to: 'Pune',
        date: getDate(0, 21, 30), // Later today
        price: 350,
        seats: 3,
        driver: createdDrivers[0]._id,
        vehicle: 'Maruti Ertiga',
        vehicleColor: 'Pearl White'
      },
      {
        from: 'Mumbai',
        to: 'Pune',
        date: getDate(1, 7, 0), // Tomorrow morning
        price: 360,
        seats: 3,
        driver: createdDrivers[1]._id,
        vehicle: 'Honda City',
        vehicleColor: 'Silver Metallic'
      },
      {
        from: 'Mumbai',
        to: 'Pune',
        date: getDate(1, 14, 30), // Tomorrow afternoon
        price: 380,
        seats: 2,
        driver: createdDrivers[2]._id,
        vehicle: 'Hyundai Creta',
        vehicleColor: 'Phantom Black'
      },
      {
        from: 'Mumbai',
        to: 'Pune',
        date: getDate(1, 18, 0), // Tomorrow evening
        price: 350,
        seats: 4,
        driver: createdDrivers[0]._id,
        vehicle: 'Maruti Ertiga',
        vehicleColor: 'Pearl White'
      },
      {
        from: 'Mumbai',
        to: 'Pune',
        date: getDate(2, 8, 30),
        price: 340,
        seats: 3,
        driver: createdDrivers[1]._id,
        vehicle: 'Honda City',
        vehicleColor: 'Silver Metallic'
      },
      // Pune -> Mumbai
      {
        from: 'Pune',
        to: 'Mumbai',
        date: getDate(1, 9, 0),
        price: 360,
        seats: 3,
        driver: createdDrivers[2]._id,
        vehicle: 'Hyundai Creta',
        vehicleColor: 'Phantom Black'
      },
      {
        from: 'Pune',
        to: 'Mumbai',
        date: getDate(1, 17, 30),
        price: 350,
        seats: 2,
        driver: createdDrivers[0]._id,
        vehicle: 'Maruti Ertiga',
        vehicleColor: 'Pearl White'
      },
      // New Delhi -> Chandigarh
      {
        from: 'New Delhi',
        to: 'Chandigarh',
        date: getDate(1, 6, 30),
        price: 480,
        seats: 3,
        driver: createdDrivers[4]._id,
        vehicle: 'Skoda Slavia',
        vehicleColor: 'Candy White'
      },
      {
        from: 'New Delhi',
        to: 'Chandigarh',
        date: getDate(1, 16, 0),
        price: 490,
        seats: 2,
        driver: createdDrivers[4]._id,
        vehicle: 'Skoda Slavia',
        vehicleColor: 'Candy White'
      },
      // Bengaluru -> Mysuru
      {
        from: 'Bengaluru',
        to: 'Mysuru',
        date: getDate(1, 8, 0),
        price: 300,
        seats: 3,
        driver: createdDrivers[3]._id,
        vehicle: 'Kia Seltos',
        vehicleColor: 'Gravity Grey'
      },
      {
        from: 'Bengaluru',
        to: 'Mysuru',
        date: getDate(1, 17, 0),
        price: 310,
        seats: 3,
        driver: createdDrivers[3]._id,
        vehicle: 'Kia Seltos',
        vehicleColor: 'Gravity Grey'
      },
      // Chennai -> Pondicherry
      {
        from: 'Chennai',
        to: 'Pondicherry',
        date: getDate(1, 7, 30),
        price: 320,
        seats: 3,
        driver: createdDrivers[1]._id,
        vehicle: 'Honda City',
        vehicleColor: 'Silver Metallic'
      },
      // Hyderabad -> Vijayawada
      {
        from: 'Hyderabad',
        to: 'Vijayawada',
        date: getDate(1, 6, 0),
        price: 550,
        seats: 3,
        driver: createdDrivers[2]._id,
        vehicle: 'Hyundai Creta',
        vehicleColor: 'Phantom Black'
      },
      // Pune -> Goa
      {
        from: 'Pune',
        to: 'Goa',
        date: getDate(2, 6, 0),
        price: 850,
        seats: 3,
        driver: createdDrivers[0]._id,
        vehicle: 'Maruti Ertiga',
        vehicleColor: 'Pearl White'
      }
    ];

    const createdRides = await Ride.insertMany(ridesData);
    console.log(`Created ${createdRides.length} realistic rides.`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
