import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api';
import { AuthContext } from '../context/AuthContext';
import Seo from '../components/Seo';

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => { if (user) getOrders().then((r) => setOrders(r.data)); }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="My Orders" />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-serif font-semibold text-gray-900 mb-10">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-4">No orders yet</p>
            <Link to="/books" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Start shopping &rarr;</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order._id} to={`/orders/${order._id}`}
                className="block bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-indigo-200 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 font-mono">{order._id}</p>
                    <p className="text-sm text-gray-900 font-medium mt-0.5">
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 && 's'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">&curren;{order.total?.toLocaleString('en-IN')}</p>
                    <span className={`inline-block mt-1.5 px-2.5 py-0.5 text-xs font-medium border rounded ${statusColors[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {order.status || 'Unknown'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
