import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getOrders } from '../api';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) getOrders().then((res) => setOrders(res.data)).catch(() => {});
  }, [user]);

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (!user) {
    return <div className="text-center py-20 text-xl">Please <Link to="/login" className="text-blue-600">login</Link> to view orders.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl mb-4">No orders yet</p>
          <Link to="/books" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">Order #{order._id.slice(-6).toUpperCase()}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-3 border-t py-2">
                  <span className="flex-1">{item.book?.title || 'Book'}</span>
                  <span>x{item.quantity}</span>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="text-right font-bold text-lg mt-2">Total: ${order.totalAmount.toFixed(2)}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
