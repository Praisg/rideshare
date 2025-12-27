import { create } from 'zustand';

export const useDataStore = create((set) => ({
  users: [],
  rides: [],
  kycSubmissions: [],
  stats: {
    totalUsers: 0,
    totalRiders: 0,
    totalCustomers: 0,
    totalRides: 0,
    activeRides: 0,
    completedRides: 0,
    totalRevenue: 0,
    pendingKyc: 0,
  },
  
  setUsers: (users) => set({ users }),
  setRides: (rides) => set({ rides }),
  setKycSubmissions: (kycSubmissions) => set({ kycSubmissions }),
  setStats: (stats) => set({ stats }),
  
  updateRide: (rideId, updates) => 
    set((state) => ({
      rides: state.rides.map(ride => 
        ride._id === rideId ? { ...ride, ...updates } : ride
      )
    })),
    
  updateUser: (userId, updates) =>
    set((state) => ({
      users: state.users.map(user =>
        user._id === userId ? { ...user, ...updates } : user
      )
    })),
}));

