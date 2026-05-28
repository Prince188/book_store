import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api';
import Seo from '../components/Seo';

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => { getOrder(id).then((r) => setOrder(r.data)).catch(() => {}); }, [id]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="Order Detail" />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-8 inline-block">
          &larr; Back to orders
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Order</p>
              <h1 className="text-xl font-serif font-semibold text-gray-900 mt-1 font-mono text-sm">{order._id}</h1>
            </div>
            <span className={`px-3 py-1 text-xs font-medium border rounded ${statusColors[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {order.status || 'Unknown'}
            </span>
          </div>
          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>

          <hr className="border-gray-200 my-6" />

          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.book?.title || item.title || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">&curren;{item.price?.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>

          <hr className="border-gray-200 my-6" />

          {order.subtotal != null && (
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>&curren;{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-&curren;{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between text-base font-semibold text-gray-900 mt-3 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>&curren;{order.total?.toLocaleString('en-IN')}</span>
          </div>

          {order.shippingAddress && (
            <>
              <hr className="border-gray-200 my-6" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Shipping address</p>
                <p className="text-sm text-gray-700 leading-relaxed">{order.shippingAddress}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
