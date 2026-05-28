import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api';

const statuses = ['pending', 'shipped', 'delivered', 'cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => { getAllOrders().then((r) => setOrders(r.data)).catch(() => {}); }, []);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, { status });
    setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  const badge = (status) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-600',
      shipped: 'bg-blue-50 text-blue-600',
      delivered: 'bg-emerald-50 text-emerald-600',
      cancelled: 'bg-red-50 text-red-500',
    };
    return `text-xs font-semibold px-3 py-1 rounded-lg ${styles[status] || styles.pending}`;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.user?.name || 'Unknown'} &lt;{order.user?.email || ''}&gt;</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={badge(order.status)}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  <select value={order.status} onChange={(e) => handleStatus(order._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="border-t border-gray-50 pt-3 space-y-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.book?.title || 'Book'} <span className="text-gray-400">x{item.quantity}</span></span>
                    <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 pt-1">
                  <span>Discount {order.coupon && <span>({order.coupon.code})</span>}</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
