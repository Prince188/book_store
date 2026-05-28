import { useState, useEffect, useContext } from 'react';
import { getAllOrders, updateOrderStatus } from '../api';
import { ToastContext } from '../context/ToastContext';
import Seo from '../components/Seo';

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const ManageOrders = () => {
  const { addToast } = useContext(ToastContext);
  const [orders, setOrders] = useState([]);

  const load = () => getAllOrders().then((r) => setOrders(r.data)).catch(() => {});
  useEffect(load, []);

  const handleStatus = async (id, status) => {
    try { await updateOrderStatus(id, { status }); addToast('Status updated'); load(); }
    catch (err) { addToast('Failed to update', 'error'); }
  };

  return (
    <div>
      <Seo title="Manage Orders" />
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Fulfillment</p>
        <h1 className="text-3xl font-serif font-semibold text-gray-900 mt-2">Orders</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">User</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Items</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{o._id.slice(-8)}</td>
                  <td className="py-3 px-4 text-gray-700">{o.user?.name || o.user?.email || 'N/A'}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{o.items?.length || 0}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">&curren;{o.total?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <select value={o.status} onChange={(e) => handleStatus(o._id, e.target.value)}
                      className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
