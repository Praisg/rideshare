import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Ride from './models/Ride.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'John Doe',
    role: 'customer',
    phone: '+254712345001',
    stats: {
      totalRides: 8,
      completedRides: 7,
      cancelledRides: 1,
      rating: 4.8,
      totalRatings: 7,
    },
  },
  {
    name: 'Jane Smith',
    role: 'customer',
    phone: '+254712345002',
    stats: {
      totalRides: 5,
      completedRides: 5,
      cancelledRides: 0,
      rating: 5.0,
      totalRatings: 5,
    },
  },
  {
    name: 'Alice Johnson',
    role: 'customer',
    phone: '+254712345003',
    stats: {
      totalRides: 12,
      completedRides: 10,
      cancelledRides: 2,
      rating: 4.5,
      totalRatings: 10,
    },
  },
  {
    name: 'David Brown',
    role: 'rider',
    phone: '+254723456001',
    kyc: {
      status: 'approved',
      idType: 'national_id',
      idNumber: 'ID123456789',
      fullName: 'John Doe',
      dateOfBirth: new Date('1990-05-15'),
      address: '123 Main Street, Nairobi',
      submittedAt: new Date('2024-12-01'),
      verifiedAt: new Date('2024-12-02'),
    },
    earnings: {
      total: 2450.00,
      available: 2200.00,
      pendingWithdrawal: 250.00,
    },
    stats: {
      totalRides: 45,
      completedRides: 42,
      cancelledRides: 3,
      rating: 4.9,
      totalRatings: 40,
    },
  },
  {
    name: 'Emma Wilson',
    role: 'rider',
    phone: '+254723456002',
    kyc: {
      status: 'approved',
      idType: 'drivers_license',
      idNumber: 'DL987654321',
      fullName: 'Jane Smith',
      dateOfBirth: new Date('1988-08-22'),
      address: '456 Park Avenue, Nairobi',
      submittedAt: new Date('2024-12-03'),
      verifiedAt: new Date('2024-12-04'),
    },
    earnings: {
      total: 3200.00,
      available: 3000.00,
      pendingWithdrawal: 200.00,
    },
    stats: {
      totalRides: 60,
      completedRides: 58,
      cancelledRides: 2,
      rating: 4.95,
      totalRatings: 55,
    },
  },
  {
    name: 'Mike Johnson',
    role: 'rider',
    phone: '+254723456003',
    kyc: {
      status: 'submitted',
      idType: 'national_id',
      idNumber: 'ID555666777',
      fullName: 'Mike Johnson',
      dateOfBirth: new Date('1992-03-10'),
      address: '789 Ocean Road, Mombasa',
      idFrontImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      submittedAt: new Date('2024-12-20'),
    },
    earnings: {
      total: 0,
      available: 0,
      pendingWithdrawal: 0,
    },
    stats: {
      totalRides: 0,
      completedRides: 0,
      cancelledRides: 0,
      rating: 5.0,
      totalRatings: 0,
    },
  },
  {
    name: 'Sarah Williams',
    role: 'rider',
    phone: '+254723456004',
    kyc: {
      status: 'submitted',
      idType: 'passport',
      idNumber: 'PP123456',
      fullName: 'Sarah Williams',
      dateOfBirth: new Date('1995-11-30'),
      address: '321 Kenyatta Avenue, Kisumu',
      idFrontImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      submittedAt: new Date('2024-12-21'),
    },
    earnings: {
      total: 0,
      available: 0,
      pendingWithdrawal: 0,
    },
    stats: {
      totalRides: 0,
      completedRides: 0,
      cancelledRides: 0,
      rating: 5.0,
      totalRatings: 0,
    },
  },
];

const generateRides = (users) => {
  const rides = [];
  const customers = users.filter(u => u.role === 'customer');
  const riders = users.filter(u => u.role === 'rider' && u.kyc.status === 'approved');

  const pickupLocations = [
    { address: 'Jomo Kenyatta International Airport, Nairobi', latitude: -1.3193, longitude: 36.9275 },
    { address: 'Westlands, Nairobi', latitude: -1.2673, longitude: 36.8103 },
    { address: 'Karen, Nairobi', latitude: -1.3197, longitude: 36.7073 },
    { address: 'CBD Nairobi', latitude: -1.2864, longitude: 36.8172 },
    { address: 'Kilimani, Nairobi', latitude: -1.2912, longitude: 36.7879 },
  ];

  const dropLocations = [
    { address: 'Nairobi National Museum', latitude: -1.2767, longitude: 36.8156 },
    { address: 'Two Rivers Mall, Nairobi', latitude: -1.2254, longitude: 36.8567 },
    { address: 'Sarit Centre, Westlands', latitude: -1.2614, longitude: 36.8055 },
    { address: 'Village Market, Gigiri', latitude: -1.2334, longitude: 36.8047 },
    { address: 'Yaya Centre, Kilimani', latitude: -1.2914, longitude: 36.7844 },
  ];

  const vehicles = ['bike', 'cabEconomy', 'cabPremium', 'human'];

  for (let i = 0; i < 25; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const rider = riders[Math.floor(Math.random() * riders.length)];
    const pickup = pickupLocations[Math.floor(Math.random() * pickupLocations.length)];
    const drop = dropLocations[Math.floor(Math.random() * dropLocations.length)];
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const distance = (Math.random() * 15 + 2).toFixed(2);
    const fare = parseFloat((distance * (vehicle === 'bike' ? 50 : vehicle === 'cabPremium' ? 120 : 80) + Math.random() * 100).toFixed(2));

    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    rides.push({
      vehicle,
      distance: parseFloat(distance),
      pickup,
      drop,
      fare,
      proposedPrice: fare,
      suggestedPriceRange: {
        min: fare * 0.8,
        max: fare * 1.2,
      },
      pricingModel: 'bidding',
      customer: customer._id,
      rider: rider._id,
      status: 'COMPLETED',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt,
      updatedAt: createdAt,
    });
  }

  for (let i = 0; i < 5; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const rider = riders[Math.floor(Math.random() * riders.length)];
    const pickup = pickupLocations[Math.floor(Math.random() * pickupLocations.length)];
    const drop = dropLocations[Math.floor(Math.random() * dropLocations.length)];
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const distance = (Math.random() * 15 + 2).toFixed(2);
    const fare = parseFloat((distance * (vehicle === 'bike' ? 50 : vehicle === 'cabPremium' ? 120 : 80) + Math.random() * 100).toFixed(2));

    rides.push({
      vehicle,
      distance: parseFloat(distance),
      pickup,
      drop,
      fare,
      proposedPrice: fare,
      suggestedPriceRange: {
        min: fare * 0.8,
        max: fare * 1.2,
      },
      pricingModel: 'bidding',
      customer: customer._id,
      rider: rider._id,
      status: 'START',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return rides;
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Ride.deleteMany({});
    console.log('Cleared existing data');

    const users = await User.insertMany(sampleUsers);
    console.log(`Created ${users.length} users`);

    const rides = generateRides(users);
    await Ride.insertMany(rides);
    console.log(`Created ${rides.length} rides`);

    const stats = {
      totalUsers: await User.countDocuments(),
      totalRiders: await User.countDocuments({ role: 'rider' }),
      totalCustomers: await User.countDocuments({ role: 'customer' }),
      totalRides: await Ride.countDocuments(),
      completedRides: await Ride.countDocuments({ status: 'COMPLETED' }),
      activeRides: await Ride.countDocuments({ status: 'START' }),
      pendingKyc: await User.countDocuments({ role: 'rider', 'kyc.status': 'submitted' }),
    };

    console.log('\n=== Database Seeded Successfully! ===');
    console.log(JSON.stringify(stats, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

