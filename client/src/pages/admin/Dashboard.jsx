import { useState, useEffect } from 'react';
import { getBooks, getAllOrders } from '../../api';

const Dashboard = () => {
  const [stats, setStats] = useState({ books: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([getBooks({ limit: 1 }), getAllOrders()])
      .then(([booksRes, ordersRes]) => {
        const orders = ordersRes.data;
        const revenue = orders.reduce((s, o) => s + o.totalAmount, 0);
        setStats({ books: booksRes.data.total, orders: orders.length, revenue });
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Total books</p>
            <p className="text-4xl font-bold text-gray-900">{stats.books}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Total orders</p>
            <p className="text-4xl font-bold text-gray-900">{stats.orders}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Revenue</p>
            <p className="text-4xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
