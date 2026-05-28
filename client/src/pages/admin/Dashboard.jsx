import { useState, useEffect } from 'react';
import { getBooks, getAllOrders, getSalesStats } from '../../api';
import Seo from '../../components/Seo';
import { StatsCardSkeleton } from '../../components/Skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const [stats, setStats] = useState({ books: 0, orders: 0, revenue: 0 });
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBooks({ limit: 1 }), getAllOrders(), getSalesStats()])
      .then(([booksRes, ordersRes, salesRes]) => {
        const orders = ordersRes.data;
        const revenue = orders.reduce((s, o) => s + o.totalAmount, 0);
        setStats({ books: booksRes.data.total, orders: orders.length, revenue });
        setSales(salesRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8"><h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1><div className="grid grid-cols-1 md:grid-cols-4 gap-6">{[1,2,3,4].map(i => <StatsCardSkeleton key={i} />)}</div></div>
  );

  const statusChart = sales?.statusCounts?.map((s) => ({ name: s._id, value: s.count })) || [];

  return (
    <div className="p-8">
      <Seo title="Admin — Dashboard" />
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Total books</p>
          <p className="text-3xl font-bold text-gray-900">{stats.books}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Total orders</p>
          <p className="text-3xl font-bold text-gray-900">{stats.orders}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Revenue</p>
          <p className="text-3xl font-bold text-gray-900">₹{stats.revenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Total lifetime revenue</p>
          <p className="text-3xl font-bold text-gray-900">₹{(sales?.totalRevenue || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Daily Sales (30 days)</h2>
          {sales?.dailySales?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sales.dailySales}>
                <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm py-8 text-center">No sales data yet</p>}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Orders by Status</h2>
          {statusChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusChart} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                  {statusChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm py-8 text-center">No orders yet</p>}
        </div>
      </div>

      {sales?.topBooks?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top Selling Books</h2>
          <div className="space-y-2">
            {sales.topBooks.map((b, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                  <span className="text-sm font-medium text-gray-900">{b.title || 'Unknown'}</span>
                </div>
                <div className="flex gap-6 text-sm">
                  <span className="text-gray-500">{b.sold} sold</span>
                  <span className="font-medium text-gray-900">₹{(b.revenue || 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
