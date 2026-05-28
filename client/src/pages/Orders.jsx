import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getOrders } from '../api';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => { if (user) getOrders().then((r) => setOrders(r.data)).catch(() => {}); }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl border border-gray-100 p-12 shadow-sm max-w-sm mx-6">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view orders</h2>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {orders.length === 0 ? (
          <div className="text-center bg-white rounded-3xl border border-gray-100 p-12 shadow-sm max-w-sm mx-auto">
            <p className="text-gray-500 mb-6">No orders yet.</p>
            <Link to="/books" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link to={`/orders/${order._id}`} key={order._id} className="block bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${
                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                    order.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                    order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="border-t border-gray-50 pt-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.book?.title || 'Book'} <span className="text-gray-400">x{item.quantity}</span></span>
                      <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
