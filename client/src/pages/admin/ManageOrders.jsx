import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api';
import Seo from '../../components/Seo';

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
      pending: 'bg-[#EBE6DC]/50 text-[#6B655D]',
      shipped: 'bg-blue-50 text-blue-600',
      delivered: 'bg-emerald-50 text-emerald-600',
      cancelled: 'bg-red-50 text-red-500',
    };
    return `text-xs font-semibold px-3 py-1 ${styles[status] || styles.pending}`;
  };

  return (
    <div className="p-8">
      <Seo title="Admin — Orders" />
      <h1 className="text-2xl font-serif text-[#2A2724] mb-8">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-[#A8A096] text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-[#EBE6DC] p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-[#2A2724]">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-[#A8A096] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-[#6B655D] mt-0.5">{order.user?.name || 'Unknown'} &lt;{order.user?.email || ''}&gt;</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={badge(order.status)}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  <select value={order.status} onChange={(e) => handleStatus(order._id, e.target.value)}
                    className="text-xs border border-[#D9D3C7] px-2 py-1.5 focus:outline-none focus:border-[#9C8B73]">
                    {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="border-t border-[#EBE6DC] pt-3 space-y-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-[#6B655D]">{item.book?.title || 'Book'} <span className="text-[#A8A096]">x{item.quantity}</span></span>
                    <span className="text-[#2A2724]">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 pt-1">
                  <span>Discount {order.coupon && <span>({order.coupon.code})</span>}</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-[#EBE6DC] mt-2 pt-2 flex justify-between font-bold text-[#2A2724]">
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
