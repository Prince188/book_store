import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api';

const statuses = ['pending', 'shipped', 'delivered', 'cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAllOrders().then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, { status });
    setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</span>
                <span className="ml-4 text-sm text-gray-500">
                  by {order.user?.name || 'Unknown'} ({order.user?.email || ''})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatus(order._id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center gap-3 border-t py-2 text-sm">
                <span className="flex-1">{item.book?.title || 'Book'}</span>
                <span>x{item.quantity}</span>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="text-right font-bold text-lg mt-2">Total: ${order.totalAmount.toFixed(2)}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-500 text-center py-10">No orders yet.</p>}
      </div>
    </div>
  );
};

export default ManageOrders;
