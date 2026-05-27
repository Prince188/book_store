import { useState, useEffect } from 'react';
import { getBooks, getAllOrders } from '../../api';

const Dashboard = () => {
  const [stats, setStats] = useState({ books: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      getBooks({ limit: 1 }),
      getAllOrders(),
    ]).then(([booksRes, ordersRes]) => {
      const orders = ordersRes.data;
      const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      setStats({ books: booksRes.data.total, orders: orders.length, revenue });
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
          <p className="text-gray-500 text-sm">Total Books</p>
          <p className="text-4xl font-bold text-blue-700">{stats.books}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-8 border border-green-200">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-4xl font-bold text-green-700">{stats.orders}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-8 border border-yellow-200">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-4xl font-bold text-yellow-700">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
