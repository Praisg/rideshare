import User from '../models/User.js';
import Ride from '../models/Ride.js';
import Admin from '../models/Admin.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  try {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      if (email === 'admin@ride.com' && password === 'admin123') {
        admin = new Admin({
          email: 'admin@ride.com',
          password: 'admin123',
          name: 'System Administrator',
          role: 'super_admin',
        });
        await admin.save();
      } else {
        throw new UnauthenticatedError('Invalid credentials');
      }
    } else {
      if (admin.password !== password) {
        throw new UnauthenticatedError('Invalid credentials');
      }
    }

    if (!admin.isActive) {
      throw new UnauthenticatedError('Admin account is inactive');
    }

    const accessToken = admin.createAccessToken();

    res.status(StatusCodes.OK).json({
      message: 'Login successful',
      access_token: accessToken,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRiders = await User.countDocuments({ role: 'rider' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalRides = await Ride.countDocuments();
    const activeRides = await Ride.countDocuments({ 
      status: { $in: ['SEARCHING_FOR_RIDER', 'START', 'ARRIVED'] } 
    });
    const completedRides = await Ride.countDocuments({ status: 'COMPLETED' });
    const pendingKyc = await User.countDocuments({ 
      role: 'rider', 
      'kyc.status': 'submitted' 
    });

    const completedRidesData = await Ride.find({ status: 'COMPLETED' });
    const totalRevenue = completedRidesData.reduce((sum, ride) => sum + ride.fare, 0);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayRides = await Ride.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });

      const dayRevenue = await Ride.aggregate([
        {
          $match: {
            createdAt: { $gte: date, $lt: nextDate },
            status: 'COMPLETED'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$fare' }
          }
        }
      ]);

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rides: dayRides,
        revenue: dayRevenue[0]?.total || 0
      });
    }

    res.status(StatusCodes.OK).json({
      stats: {
        totalUsers,
        totalRiders,
        totalCustomers,
        totalRides,
        activeRides,
        completedRides,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingKyc,
      },
      chartData: last7Days,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    throw new BadRequestError('Failed to fetch dashboard stats');
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role && role !== 'all' ? { role } : {};

    const users = await User.find(query)
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      message: 'Users retrieved successfully',
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    throw new BadRequestError('Failed to fetch users');
  }
};

export const getAllRides = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'all' ? { status } : {};

    const rides = await Ride.find(query)
      .populate('customer', 'phone kyc')
      .populate('rider', 'phone kyc')
      .populate('offers.riderId', 'phone kyc')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(StatusCodes.OK).json({
      message: 'Rides retrieved successfully',
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error('Get rides error:', error);
    throw new BadRequestError('Failed to fetch rides');
  }
};

export const getKYCSubmissions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { 
      role: 'rider'
    };

    if (status && status !== 'all') {
      query['kyc.status'] = status;
    }

    const submissions = await User.find(query)
      .select('-__v')
      .sort({ 'kyc.submittedAt': -1 });

    res.status(StatusCodes.OK).json({
      message: 'KYC submissions retrieved successfully',
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error('Get KYC submissions error:', error);
    throw new BadRequestError('Failed to fetch KYC submissions');
  }
};

export const getFinancials = async (req, res) => {
  try {
    const completedRides = await Ride.find({ status: 'COMPLETED' });
    
    const totalRevenue = completedRides.reduce((sum, ride) => sum + ride.fare, 0);
    const platformFees = totalRevenue * 0.2;
    const riderEarnings = totalRevenue * 0.8;

    const revenueByVehicle = await Ride.aggregate([
      { $match: { status: 'COMPLETED' } },
      {
        $group: {
          _id: '$vehicle',
          total: { $sum: '$fare' }
        }
      }
    ]);

    const vehicleData = revenueByVehicle.map(item => ({
      name: item._id,
      value: Math.round(item.total * 100) / 100
    }));

    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const monthRevenue = await Ride.aggregate([
        {
          $match: {
            createdAt: { $gte: date, $lt: nextMonth },
            status: 'COMPLETED'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$fare' }
          }
        }
      ]);

      const revenue = monthRevenue[0]?.total || 0;
      last6Months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: Math.round(revenue * 100) / 100,
        platformFee: Math.round(revenue * 0.2 * 100) / 100
      });
    }

    const transactions = completedRides.slice(0, 50).map(ride => ({
      date: ride.createdAt,
      rideId: ride._id.toString().slice(-8),
      vehicle: ride.vehicle,
      fare: ride.fare,
      platformFee: ride.fare * 0.2,
      riderEarning: ride.fare * 0.8
    }));

    res.status(StatusCodes.OK).json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      platformFees: Math.round(platformFees * 100) / 100,
      riderEarnings: Math.round(riderEarnings * 100) / 100,
      revenueByVehicle: vehicleData,
      monthlyRevenue: last6Months,
      transactions,
    });
  } catch (error) {
    console.error('Get financials error:', error);
    throw new BadRequestError('Failed to fetch financial data');
  }
};

