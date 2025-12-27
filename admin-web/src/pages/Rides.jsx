import { useEffect, useState } from 'react';
import { Car, MapPin, DollarSign, Clock, TrendingUp, Users as UsersIcon } from 'lucide-react';
import api from '../services/api';

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRides();
  }, [filter]);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/rides?status=${filter}`);
      setRides(response.data.rides);
    } catch (error) {
      console.error('Failed to fetch rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      AWAITING_OFFERS: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
      SEARCHING_FOR_RIDER: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
      START: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
      ARRIVED: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
      COMPLETED: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
    };
    const style = styles[status] || styles.SEARCHING_FOR_RIDER;
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 ${style.bg} ${style.text} rounded-lg text-xs font-semibold`}>
        <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getVehicleBadge = (vehicle) => {
    const vehicles = {
      bike: { emoji: '🏍️', label: 'Bike', color: 'from-orange-500 to-red-600' },
      human: { emoji: '🚶', label: 'Human', color: 'from-green-500 to-emerald-600' },
      cabEconomy: { emoji: '🚗', label: 'Cab Economy', color: 'from-blue-500 to-blue-600' },
      cabPremium: { emoji: '🚙', label: 'Cab Premium', color: 'from-purple-500 to-purple-600' },
    };
    const v = vehicles[vehicle] || vehicles.bike;
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${v.color} text-white rounded-xl font-semibold shadow-lg`}>
        <span className="text-lg">{v.emoji}</span>
        <span>{v.label}</span>
      </div>
    );
  };

  const filterOptions = [
    { value: 'all', label: 'All Rides' },
    { value: 'AWAITING_OFFERS', label: 'Awaiting Offers' },
    { value: 'START', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Ride Management</h1>
        <p className="text-slate-500 mt-1">Monitor and manage all rides on the platform</p>
      </div>

      <div className="bg-white rounded-2xl p-2 border border-slate-200 inline-flex gap-1 overflow-x-auto">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              filter === option.value
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {rides.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No rides found</h3>
              <p className="text-slate-500">No rides match the current filter</p>
            </div>
          ) : (
            rides.map((ride) => (
              <div key={ride._id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {getVehicleBadge(ride.vehicle)}
                    {getStatusBadge(ride.status)}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${ride.fare.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{ride.distance.toFixed(1)} km</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-emerald-700 mb-1">PICKUP</p>
                        <p className="text-sm text-slate-700 break-words">{ride.pickup.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-red-700 mb-1">DROP-OFF</p>
                        <p className="text-sm text-slate-700 break-words">{ride.drop.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <DollarSign size={20} className="text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Pricing Model</p>
                        <p className="text-slate-800 font-semibold">
                          {ride.pricingModel === 'bidding' ? 'Bidding' : 'Fixed Price'}
                        </p>
                      </div>
                    </div>
                    {ride.pricingModel === 'bidding' && (
                      <>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                          <TrendingUp size={20} className="text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Proposed Price</p>
                            <p className="text-slate-800 font-semibold">${ride.proposedPrice.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <UsersIcon size={20} className="text-blue-600" />
                          <div>
                            <p className="text-xs text-blue-700 font-medium">Total Offers</p>
                            <p className="text-blue-800 font-bold text-lg">{ride.offers?.length || 0}</p>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <Clock size={20} className="text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Created</p>
                        <p className="text-slate-800 font-semibold text-sm">
                          {new Date(ride.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-700 font-semibold mb-2">Customer</p>
                    <p className="font-bold text-slate-800">
                      {ride.customer?.kyc?.fullName || ride.customer?.phone || 'N/A'}
                    </p>
                    {ride.customer?.phone && (
                      <p className="text-sm text-slate-600 mt-1">{ride.customer.phone}</p>
                    )}
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-xs text-purple-700 font-semibold mb-2">Rider</p>
                    <p className="font-bold text-slate-800">
                      {ride.rider?.kyc?.fullName || ride.rider?.phone || 'Not assigned'}
                    </p>
                    {ride.rider?.phone && (
                      <p className="text-sm text-slate-600 mt-1">{ride.rider.phone}</p>
                    )}
                  </div>
                </div>

                {ride.offers && ride.offers.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-sm font-bold text-slate-800 mb-3">
                      Driver Offers ({ride.offers.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ride.offers.slice(0, 3).map((offer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-sm text-slate-700 font-medium truncate pr-2">
                            {offer.riderId?.kyc?.fullName || offer.riderId?.phone || 'Unknown'}
                          </span>
                          <span className="font-bold text-blue-600">${offer.offeredPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
