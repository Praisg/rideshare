import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import User from '../models/User.js';
import Ride from '../models/Ride.js';

// Define tools for the AI Agent
const getPendingKycTool = tool({
  name: 'get_pending_kyc',
  description: 'Get all pending KYC submissions that need review',
  parameters: z.object({}),
  execute: async () => {
    const pendingKyc = await User.find({ 
      'kyc.status': 'submitted',
      role: 'rider' 
    }).select('name phone kyc');
    
    return {
      count: pendingKyc.length,
      submissions: pendingKyc.map(user => ({
        userId: user._id.toString(),
        name: user.name,
        phone: user.phone,
        idType: user.kyc.idType,
        submittedAt: user.kyc.submittedAt,
        frontImage: user.kyc.idFrontImage ? 'present' : 'missing',
        backImage: user.kyc.idBackImage ? 'present' : 'missing',
      })),
    };
  },
});

const approveKycTool = tool({
  name: 'approve_kyc',
  description: 'Approve a KYC submission for a user',
  parameters: z.object({
    userId: z.string().describe('The user ID to approve'),
  }),
  execute: async ({ userId }) => {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    user.kyc.status = 'approved';
    user.kyc.reviewedAt = new Date();
    user.kyc.adminNotes = 'Approved by AI Agent';
    await user.save();

    return { 
      success: true, 
      message: `KYC approved for ${user.name}` 
    };
  },
});

const rejectKycTool = tool({
  name: 'reject_kyc',
  description: 'Reject a KYC submission for a user',
  parameters: z.object({
    userId: z.string().describe('The user ID to reject'),
    reason: z.string().describe('Reason for rejection'),
  }),
  execute: async ({ userId, reason }) => {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    user.kyc.status = 'rejected';
    user.kyc.reviewedAt = new Date();
    user.kyc.rejectionReason = reason;
    await user.save();

    return { 
      success: true, 
      message: `KYC rejected for ${user.name}: ${reason}` 
    };
  },
});

const getPlatformStatsTool = tool({
  name: 'get_platform_stats',
  description: 'Get overall platform statistics including users, rides, and revenue',
  parameters: z.object({}),
  execute: async () => {
    const [totalUsers, totalRiders, totalCustomers, totalRides, completedRides, activeRides] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'rider' }),
      User.countDocuments({ role: 'customer' }),
      Ride.countDocuments(),
      Ride.countDocuments({ status: 'completed' }),
      Ride.countDocuments({ status: { $in: ['pending', 'accepted', 'started'] } }),
    ]);

    const revenueData = await Ride.aggregate([
      { $match: { status: 'completed' } },
      { 
        $group: { 
          _id: null, 
          totalRevenue: { $sum: '$fare' },
          averageFare: { $avg: '$fare' },
        } 
      },
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, averageFare: 0 };

    return {
      users: { total: totalUsers, riders: totalRiders, customers: totalCustomers },
      rides: { total: totalRides, completed: completedRides, active: activeRides },
      revenue: { 
        total: revenue.totalRevenue.toFixed(2), 
        average: revenue.averageFare.toFixed(2) 
      },
    };
  },
});

const getRecentRidesTool = tool({
  name: 'get_recent_rides',
  description: 'Get recent rides, defaults to 10 most recent rides',
  parameters: z.object({}),
  execute: async () => {
    const limit = 10;
    const status = null;
    const query = status ? { status } : {};
    const rides = await Ride.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('customer', 'name phone')
      .populate('rider', 'name phone')
      .lean();

    return {
      count: rides.length,
      rides: rides.map(ride => ({
        id: ride._id.toString(),
        status: ride.status,
        fare: ride.fare,
        distance: ride.distance,
        customer: ride.customer?.name || 'N/A',
        rider: ride.rider?.name || 'Not assigned',
        createdAt: ride.createdAt,
      })),
    };
  },
});

const detectFraudTool = tool({
  name: 'detect_fraud',
  description: 'Analyze user patterns for potential fraud. Requires a user ID.',
  parameters: z.object({
    userId: z.string().describe('The user ID to analyze'),
  }),
  execute: async ({ userId }) => {
    const user = await User.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }

    // Simple fraud indicators
    const suspiciousPatterns = [];
    
    if (user.role === 'rider') {
      if (user.earnings > 50000) {
        suspiciousPatterns.push('Unusually high earnings');
      }
      if (user.ridesCompleted > 1000) {
        suspiciousPatterns.push('Very high ride count');
      }
    }

    return {
      userId: user._id.toString(),
      name: user.name,
      role: user.role,
      suspiciousPatterns,
      riskLevel: suspiciousPatterns.length > 0 ? 'medium' : 'low',
    };
  },
});

// Create the main Platform Manager Agent
const platformManagerAgent = new Agent({
  name: 'Platform Manager',
  instructions: `You are an AI assistant for managing the RIDE rideshare platform. You help administrators:
  
- Review and process KYC (Know Your Customer) submissions
- Monitor platform statistics and performance
- Analyze ride patterns and detect anomalies
- Provide insights and recommendations

When processing KYC:
- Check that all required documents are present (front and back ID images)
- Look for completeness and consistency in the submission
- Be thorough but fair in your assessment

Always be professional, clear, and provide actionable information.`,
  tools: [
    getPendingKycTool,
    approveKycTool,
    rejectKycTool,
    getPlatformStatsTool,
    getRecentRidesTool,
    detectFraudTool,
  ],
  model: 'gpt-4',
});

// Main function to run the agent
export async function runAgent(userMessage) {
  try {
    console.log('Running agent with message:', userMessage);
    
    const result = await run(platformManagerAgent, userMessage);
    
    console.log('Agent response received');
    
    return {
      response: result.finalOutput,
      success: true,
    };
  } catch (error) {
    console.error('Agent error:', error);
    throw error;
  }
}

// Helper function for auto-processing KYC
export async function autoProcessKyc() {
  console.log('AI Agent: Auto-processing KYC submissions...');
  
  const result = await runAgent(
    'Review all pending KYC submissions. For each one, check if documents are present. If both front and back images are present, approve it with a note. If anything is missing, reject it with a clear reason. Provide a summary of all actions taken.'
  );

  return result;
}

// Initialize function (for backward compatibility)
export async function initializeAgent() {
  console.log('✅ OpenAI Agents SDK initialized');
  return 'agent-ready';
}
