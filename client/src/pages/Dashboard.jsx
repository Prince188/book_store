import { useState, useEffect } from 'react';
import { getBooks, getAllOrders, getAllUsers } from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import Seo from '../components/Seo';

const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#6B7280'];

const Dashboard = () => {
  const [stats, setStats] = useState({ totalBooks: 0, totalOrders: 0, totalRevenue: 0, totalUsers: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      getBooks({ limit: 1 }),
      getAllOrders(),
      getAllUsers(),
    ]).then(([b, o, u]) => {
      const orders = o.data;
      const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
      setStats({ totalBooks: b.data.total || 0, totalOrders: orders.length, totalRevenue, totalUsers: u.data?.length || 0 });

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mMap = {};
      orders.forEach((ord) => {
        const d = new Date(ord.createdAt);
        const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
        mMap[key] = (mMap[key] || 0) + (ord.total || 0);
      });
      setMonthlyData(Object.entries(mMap).map(([month, revenue]) => ({ month, revenue })));

      const cMap = {};
      orders.forEach((ord) => {
        (ord.items || []).forEach((item) => {
          const cat = item.book?.categories?.[0]?.name || 'Uncategorized';
          cMap[cat] = (cMap[cat] || 0) + 1;
        });
      });
      setCatData(Object.entries(cMap).map(([name, value]) => ({ name, value })));

      setRecentOrders(orders.slice(-5).reverse());
    }).catch(() => {});
  }, []);

  return (
    <div>
      <Seo title="Admin Dashboard" />
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Overview</p>
        <h1 className="text-3xl font-serif font-semibold text-gray-900 mt-2">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Books', value: stats.totalBooks },
          { label: 'Orders', value: stats.totalOrders },
          { label: 'Revenue', value: `\u20B9${stats.totalRevenue.toLocaleString('en-IN')}`, accent: true },
          { label: 'Users', value: stats.totalUsers },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.accent ? 'text-indigo-600' : 'text-gray-900'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Orders by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name }) => name}>
                {catData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">ID</th>
                <th className="text-left py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Items</th>
                <th className="text-right py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Total</th>
                <th className="text-right py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 font-mono text-xs text-gray-500">{ord._id.slice(-8)}</td>
                  <td className="py-3 text-gray-700">{(ord.items?.length || 0)} items</td>
                  <td className="py-3 text-right font-semibold text-gray-900">&curren;{ord.total?.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right text-gray-500">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
