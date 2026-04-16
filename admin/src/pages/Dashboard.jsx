import React, { useState, useEffect } from 'react';
import { IndianRupee, Ticket, Users, Film, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchDashboardData = () => {
      setStats({
        revenue: '₹45,000',
        revenueGrowth: '+12%',
        bookings: 120,
        bookingsGrowth: '+5%',
        users: 85,
        usersGrowth: '+18%',
        movies: 15,
        moviesGrowth: '+2%',
      });

      setRecentBookings([
        { id: '#BK-1001', customer: 'Rahul Sharma', movie: 'Inception', amount: '₹500', status: 'Confirmed' },
        { id: '#BK-1002', customer: 'Priya Patel', movie: 'Dune: Part Two', amount: '₹1200', status: 'Confirmed' },
        { id: '#BK-1003', customer: 'Amit Kumar', movie: 'Oppenheimer', amount: '₹750', status: 'Pending' },
        { id: '#BK-1004', customer: 'Neha Singh', movie: 'Interstellar', amount: '₹300', status: 'Cancelled' },
        { id: '#BK-1005', customer: 'Vikram Joshi', movie: 'The Batman', amount: '₹900', status: 'Confirmed' },
      ]);
    };

    fetchDashboardData();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        Loading Dashboard...
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: stats.revenue, growth: stats.revenueGrowth, icon: <IndianRupee size={24} className="text-emerald-500" /> },
    { title: 'Total Bookings', value: stats.bookings, growth: stats.bookingsGrowth, icon: <Ticket size={24} className="text-blue-500" /> },
    { title: 'Registered Users', value: stats.users, growth: stats.usersGrowth, icon: <Users size={24} className="text-purple-500" /> },
    { title: 'Movies Listed', value: stats.movies, growth: stats.moviesGrowth, icon: <Film size={24} className="text-red-500" /> },
  ];

  return (
    <div className="p-8 text-white min-h-screen bg-slate-950 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-wider text-white">Admin Overview</h1>
          <p className="text-slate-400 mt-1">Welcome back. Here is what's happening with your platform today.</p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  {card.icon}
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded">
                  <TrendingUp size={14} />
                  {card.growth}
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium border-b border-slate-800">Booking ID</th>
                  <th className="px-6 py-4 font-medium border-b border-slate-800">Customer Name</th>
                  <th className="px-6 py-4 font-medium border-b border-slate-800">Movie</th>
                  <th className="px-6 py-4 font-medium border-b border-slate-800">Amount</th>
                  <th className="px-6 py-4 font-medium border-b border-slate-800">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {recentBookings.map((booking, index) => (
                  <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-300">{booking.id}</td>
                    <td className="px-6 py-4">{booking.customer}</td>
                    <td className="px-6 py-4 text-slate-300">{booking.movie}</td>
                    <td className="px-6 py-4 font-medium">{booking.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'Confirmed'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : booking.status === 'Pending'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
