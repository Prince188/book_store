import { useState, useEffect, useContext } from 'react';
import { createCoupon, getCoupons, updateCoupon, deleteCoupon } from '../api';
import { ToastContext } from '../context/ToastContext';
import Seo from '../components/Seo';

const empty = { code: '', type: 'percentage', value: '', minOrder: '', maxDiscount: '', expiry: '', usageLimit: '', maxUsePerUser: '' };

const ManageCoupons = () => {
  const { addToast } = useContext(ToastContext);
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => getCoupons().then((r) => setCoupons(Array.isArray(r.data) ? r.data : [])).catch(() => setCoupons([]));
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrder: form.minOrder ? Number(form.minOrder) : undefined,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      expiry: form.expiry || undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      maxUsePerUser: form.maxUsePerUser ? Number(form.maxUsePerUser) : undefined,
    };
    try {
      if (editing) {
        await updateCoupon(editing, payload);
        addToast('Coupon updated');
      } else {
        await createCoupon(payload);
        addToast('Coupon created');
      }
      setForm(empty); setEditing(null); setShowForm(false);
      load();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error');
    }
  };

  const handleEdit = (c) => {
    setForm({
      code: c.code || '',
      type: c.type || 'percentage',
      value: c.value?.toString() || '',
      minOrder: c.minOrder?.toString() || '',
      maxDiscount: c.maxDiscount?.toString() || '',
      expiry: c.expiry ? c.expiry.slice(0, 10) : '',
      usageLimit: c.usageLimit?.toString() || '',
      maxUsePerUser: c.maxUsePerUser?.toString() || '',
    });
    setEditing(c._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try { await deleteCoupon(id); addToast('Coupon deleted'); load(); }
    catch (err) { addToast('Failed to delete', 'error'); }
  };

  return (
    <div>
      <Seo title="Manage Coupons" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Promotions</p>
          <h1 className="text-3xl font-serif font-semibold text-gray-900 mt-2">Coupons</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all">
          {showForm ? 'Cancel' : 'Add coupon'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-6">{editing ? 'Edit coupon' : 'New coupon'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed (&curren;)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                <input value={form.value} onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setForm({ ...form, value: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min order</label>
                <input value={form.minOrder} onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setForm({ ...form, minOrder: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max discount</label>
                <input value={form.maxDiscount} onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setForm({ ...form, maxDiscount: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                <input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Global usage limit</label>
                <input value={form.usageLimit} onChange={(e) => /^\d*$/.test(e.target.value) && setForm({ ...form, usageLimit: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max per user</label>
                <input value={form.maxUsePerUser} onChange={(e) => /^\d*$/.test(e.target.value) && setForm({ ...form, maxUsePerUser: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <button type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all">
              {editing ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Type</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Value</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Min</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Used</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Expiry</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-mono text-sm font-semibold text-gray-900">{c.code}</td>
                  <td className="py-3 px-4 text-gray-600 capitalize">{c.type}</td>
                  <td className="py-3 px-4 text-right">{c.type === 'percentage' ? `${c.value}%` : `\u20B9${c.value}`}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{c.minOrder ? `\u20B9${c.minOrder}` : '--'}</td>
                  <td className="py-3 px-4 text-right">{c.usedBy?.length || 0}{c.usageLimit ? `/${c.usageLimit}` : ''}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{c.expiry ? new Date(c.expiry).toLocaleDateString('en-IN') : '--'}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleEdit(c)} className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold mr-3">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-600 text-xs font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCoupons;
