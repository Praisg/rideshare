import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Wallet, CreditCard, ArrowUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

export default function Financials() {
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    platformFees: 0,
    riderEarnings: 0,
    transactions: [],
    revenueByVehicle: [],
    monthlyRevenue: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/financials');
      setFinancialData(response.data);
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${financialData.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-blue-500 to-blue-600',
      change: '+12.5%',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Platform Fees',
      subtitle: '20% Commission',
      value: `$${financialData.platformFees.toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      change: '+12.5%',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Rider Earnings',
      subtitle: '80% Payout',
      value: `$${financialData.riderEarnings.toLocaleString()}`,
      icon: Wallet,
      gradient: 'from-emerald-500 to-emerald-600',
      change: '+12.5%',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Transactions',
      value: financialData.transactions.length,
      icon: CreditCard,
      gradient: 'from-orange-500 to-orange-600',
      change: '+8.3%',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
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
          <h1 className="text-3xl font-bold text-slate-800">Financial Dashboard</h1>
          <p className="text-slate-500 mt-1">Track revenue, earnings, and platform performance</p>
        </div>
        <button
          onClick={fetchFinancialData}
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium shadow-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon size={24} className={stat.iconColor} />
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                <ArrowUp size={16} />
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">
              {stat.title}
              {stat.subtitle && <span className="block text-xs text-slate-400">{stat.subtitle}</span>}
            </p>
            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Monthly Revenue</h2>
              <p className="text-sm text-slate-500 mt-1">Last 6 months performance</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
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
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" radius={[8, 8, 0, 0]} />
              <Bar dataKey="platformFee" fill="#8B5CF6" name="Platform Fee" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Revenue by Vehicle</h2>
            <p className="text-sm text-slate-500 mt-1">Distribution breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={financialData.revenueByVehicle}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {financialData.revenueByVehicle.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {financialData.revenueByVehicle.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-slate-700 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
          <p className="text-sm text-slate-500 mt-1">Latest completed rides</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Ride ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Total Fare
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Platform Fee
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Rider Earning
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {financialData.transactions.slice(0, 10).map((transaction, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {transaction.rideId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-800 capitalize">
                      {transaction.vehicle}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                    ${transaction.fare.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
                    ${transaction.platformFee.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                    ${transaction.riderEarning.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
