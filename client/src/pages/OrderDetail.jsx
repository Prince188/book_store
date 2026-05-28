import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder, downloadInvoice } from '../api';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrder(id)
      .then((r) => setOrder(r.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load order'));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <Link to="/orders" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">Back to orders</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleInvoice = async () => {
    try {
      const res = await downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order._id.slice(-8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch { /* ignore */ }
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

  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">

        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to orders
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
              <p className="text-sm text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
            </div>
            <span className={badge(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center gap-4">
                <img src={item.book?.image || 'https://via.placeholder.com/48x64'} alt="" className="w-12 h-16 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${item.book?._id}`} className="font-medium text-gray-900 text-sm hover:text-indigo-600 transition-colors">{item.book?.title || 'Book'}</Link>
                  <p className="text-xs text-gray-400">{item.book?.author}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900 text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{order.subtotal?.toFixed(2) || subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Discount {order.coupon && <span className="text-xs">({order.coupon.code})</span>}</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-50">
              <span>Total</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button onClick={handleInvoice}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all self-start">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Download Invoice
        </button>

        {order.user && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{order.user.name}</p>
              <p>{order.user.email}</p>
              {order.user.phone && <p>{order.user.phone}</p>}
              {order.user.address && <p>{order.user.address}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
