const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Ride = require('./models/Ride');
const Booking = require('./models/Booking');
const Negotiation = require('./models/Negotiation');
const Message = require('./models/Message');
const Review = require('./models/Review');
const RideRequest = require('./models/RideRequest');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blahblahcar';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for advanced seeding...');

    // Clear collections
    await Booking.deleteMany({});
    await Negotiation.deleteMany({});
    await Message.deleteMany({});
    await Review.deleteMany({});
    await RideRequest.deleteMany({});
    await Ride.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing data.');

    // Drivers & Passengers
    const usersData = [
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
        bio: 'Product manager travelling for weekend getaways. Love good conversations and 90s music. Women-only carpooler.'
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

    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} verified users.`);

    const now = new Date();
    const getDate = (daysAhead, hours, minutes = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() + daysAhead);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const ridesData = [
      {
        from: 'Mumbai',
        to: 'Pune',
        date: getDate(0, 22, 0),
        price: 350,
        seats: 3,
        driver: createdUsers[0]._id, // Rahul
        vehicle: 'Maruti Ertiga',
        vehicleColor: 'Pearl White',
        ladiesOnly: false,
        chattyLevel: 'BlaBla',
        luggageSize: 'Large',
        petsAllowed: true,
        smokingAllowed: false,
        acEnabled: true,
        status: 'scheduled'
      },
      {
        from: 'Mumbai',
        to: 'Pune',
        date: getDate(1, 8, 30),
        price: 360,
        seats: 3,
        driver: createdUsers[1]._id, // Pooja (Ladies Only!)
        vehicle: 'Honda City',
        vehicleColor: 'Silver Metallic',
        ladiesOnly: true,
        chattyLevel: 'BlaBlaBla',
        luggageSize: 'Medium',
        petsAllowed: false,
        smokingAllowed: false,
        acEnabled: true,
        status: 'scheduled'
      },
      {
        from: 'Mumbai',
        to: 'Pune',
        date: getDate(1, 14, 0),
        price: 380,
        seats: 2,
        driver: createdUsers[2]._id, // Amit
        vehicle: 'Hyundai Creta',
        vehicleColor: 'Phantom Black',
        ladiesOnly: false,
        chattyLevel: 'Bla',
        luggageSize: 'Large',
        petsAllowed: true,
        smokingAllowed: false,
        acEnabled: true,
        status: 'scheduled'
      },
      {
        from: 'Pune',
        to: 'Mumbai',
        date: getDate(1, 10, 0),
        price: 350,
        seats: 3,
        driver: createdUsers[0]._id,
        vehicle: 'Maruti Ertiga',
        vehicleColor: 'Pearl White',
        ladiesOnly: false,
        chattyLevel: 'BlaBla',
        luggageSize: 'Medium',
        petsAllowed: false,
        smokingAllowed: false,
        acEnabled: true,
        status: 'scheduled'
      },
      {
        from: 'New Delhi',
        to: 'Chandigarh',
        date: getDate(1, 6, 30),
        price: 480,
        seats: 3,
        driver: createdUsers[4]._id, // Vikram
        vehicle: 'Skoda Slavia',
        vehicleColor: 'Candy White',
        ladiesOnly: false,
        chattyLevel: 'Bla',
        luggageSize: 'Medium',
        petsAllowed: false,
        smokingAllowed: false,
        acEnabled: true,
        status: 'scheduled'
      },
      {
        from: 'Bengaluru',
        to: 'Mysuru',
        date: getDate(1, 7, 30),
        price: 300,
        seats: 3,
        driver: createdUsers[3]._id, // Sneha (Ladies Only!)
        vehicle: 'Kia Seltos',
        vehicleColor: 'Gravity Grey',
        ladiesOnly: true,
        chattyLevel: 'BlaBla',
        luggageSize: 'Medium',
        petsAllowed: false,
        smokingAllowed: false,
        acEnabled: true,
        status: 'scheduled'
      },
      {
        from: 'Chennai',
        to: 'Pondicherry',
        date: getDate(1, 8, 0),
        price: 320,
        seats: 3,
        driver: createdUsers[1]._id,
        vehicle: 'Honda City',
        vehicleColor: 'Silver Metallic',
        ladiesOnly: true,
        chattyLevel: 'BlaBlaBla',
        luggageSize: 'Small',
        petsAllowed: false,
        smokingAllowed: false,
        acEnabled: true,
        status: 'scheduled'
      },
      {
        from: 'Hyderabad',
        to: 'Vijayawada',
        date: getDate(1, 6, 0),
        price: 550,
        seats: 3,
        driver: createdUsers[2]._id,
        vehicle: 'Hyundai Creta',
        vehicleColor: 'Phantom Black',
        ladiesOnly: false,
        chattyLevel: 'BlaBla',
        luggageSize: 'Large',
        petsAllowed: true,
        smokingAllowed: false,
        acEnabled: true,
        status: 'scheduled'
      },
      {
        from: 'Pune',
        to: 'Goa',
        date: getDate(2, 6, 0),
        price: 850,
        seats: 3,
        driver: createdUsers[0]._id,
        vehicle: 'Maruti Ertiga',
        vehicleColor: 'Pearl White',
        ladiesOnly: false,
        chattyLevel: 'BlaBla',
        luggageSize: 'Large',
        petsAllowed: true,
        smokingAllowed: false,
        acEnabled: true,
        status: 'scheduled'
      }
    ];

    const createdRides = await Ride.insertMany(ridesData);
    console.log(`Created ${createdRides.length} enriched rides.`);

    // Seed Reviews
    await Review.create([
      {
        ride: createdRides[0]._id,
        reviewer: createdUsers[1]._id, // Pooja reviewed Rahul
        reviewee: createdUsers[0]._id,
        rating: 5,
        tags: ['Punctual', 'Safe Driver', 'Clean Car', 'Friendly'],
        comment: 'Excellent trip! Rahul was right on time at Dadar circle. Smooth highway driving and very polite.'
      },
      {
        ride: createdRides[2]._id,
        reviewer: createdUsers[3]._id, // Sneha reviewed Amit
        reviewee: createdUsers[2]._id,
        rating: 5,
        tags: ['Safe Driver', 'Clean Car'],
        comment: 'Very spacious car and comfortable drive. Plenty of room for baggage.'
      }
    ]);
    console.log('Created sample verified reviews.');

    // Seed Sample Messages
    await Message.create([
      {
        ride: createdRides[0]._id,
        sender: createdUsers[1]._id, // Pooja
        recipient: createdUsers[0]._id, // Rahul
        text: 'Hi Rahul! Where exactly is the pickup landmark at Dadar?',
        quickAction: 'Where is the pickup landmark?'
      },
      {
        ride: createdRides[0]._id,
        sender: createdUsers[0]._id, // Rahul
        recipient: createdUsers[1]._id, // Pooja
        text: 'Hey Pooja! Right near the TT circle flower market flyover pillar 12. See you there!'
      }
    ]);
    console.log('Created sample conversation thread.');

    // Seed Sample Ride Request
    await RideRequest.create([
      {
        passenger: createdUsers[1]._id,
        from: 'Thane',
        to: 'Pune',
        date: getDate(1, 18, 30),
        seats: 2,
        maxBudget: 400,
        notes: 'Need pickup near Viviana Mall. Flexible with time by 30 mins.'
      },
      {
        passenger: createdUsers[3]._id,
        from: 'Bengaluru (Koramangala)',
        to: 'Mysuru',
        date: getDate(2, 9, 0),
        seats: 1,
        maxBudget: 350,
        notes: 'Travelling with small cabin bag. Ladies only preferred.'
      }
    ]);
    console.log('Created sample ride requests on board.');

    console.log('Advanced seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
