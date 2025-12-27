import { useEffect, useState } from 'react';
import { Search, UserCheck, User as UserIcon, Star, Phone, Calendar } from 'lucide-react';
import api from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users?role=${filter}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.kyc?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    return role === 'rider' ? (
      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
        <UserCheck size={14} />
        Rider
      </span>
    ) : (
      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
        <UserIcon size={14} />
        Customer
      </span>
    );
  };

  const getKycBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
      submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
      approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    };
    const style = styles[status] || styles.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${style.bg} ${style.text} rounded-lg text-xs font-semibold`}>
        <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
        {status?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
        <p className="text-slate-500 mt-1">Manage customers and riders on the platform</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by phone or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'customer', 'rider'].map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  filter === role
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserIcon size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No users found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {user.kyc?.fullName?.charAt(0) || user.phone?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {user.kyc?.fullName || 'No Name'}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
                        <Phone size={14} />
                        {user.phone}
                      </div>
                    </div>
                  </div>
                  {getRoleBadge(user.role)}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {user.role === 'rider' && (
                    <div className="col-span-2 p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 font-medium mb-1">KYC Status</p>
                      {getKycBadge(user.kyc?.status)}
                    </div>
                  )}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 font-medium mb-1">Total Rides</p>
                    <p className="text-xl font-bold text-slate-800">{user.stats?.totalRides || 0}</p>
                  </div>
                  {user.role === 'rider' && (
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 font-medium mb-1">Rating</p>
                      <div className="flex items-center gap-1.5">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <p className="text-xl font-bold text-slate-800">
                          {user.stats?.rating?.toFixed(1) || '5.0'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {user.role === 'rider' && (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600 font-medium mb-1">Total Earnings</p>
                        <p className="text-xl font-bold text-blue-700">
                          ${user.earnings?.total?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-600 font-medium mb-1">Available</p>
                        <p className="text-lg font-semibold text-emerald-600">
                          ${user.earnings?.available?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <Calendar size={14} />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
