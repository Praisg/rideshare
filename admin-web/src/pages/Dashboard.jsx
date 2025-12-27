import { useEffect, useState } from 'react';
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp, 
  Activity,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { useDataStore } from '../store/dataStore';

export default function Dashboard() {
  const { stats, setStats } = useDataStore();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setChartData(response.data.chartData || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      change: '+12.5%',
      isPositive: true,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Active Rides',
      value: stats.activeRides,
      icon: Activity,
      gradient: 'from-emerald-500 to-emerald-600',
      change: '+5.2%',
      isPositive: true,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-purple-500 to-purple-600',
      change: '+18.3%',
      isPositive: true,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Pending KYC',
      value: stats.pendingKyc,
      icon: AlertCircle,
      gradient: 'from-orange-500 to-orange-600',
      change: '-2.4%',
      isPositive: true,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  const quickStats = [
    { label: 'Riders', value: stats.totalRiders, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Customers', value: stats.totalCustomers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completed', value: stats.completedRides, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Commission', value: `$${(stats.totalRevenue * 0.2).toLocaleString()}`, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium shadow-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon size={24} className={stat.iconColor} />
              </div>
              <span className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Rides Overview</h2>
              <p className="text-sm text-slate-500 mt-1">Last 7 days performance</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium">Week</button>
              <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Month</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rides" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <div className={`w-3 h-3 ${stat.bg} rounded-full ${stat.color.replace('text', 'bg')}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Revenue Breakdown</h2>
            <p className="text-sm text-slate-500 mt-1">Monthly revenue analysis</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
