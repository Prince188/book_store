import { useState, useEffect } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../api';
import Seo from '../../components/Seo';

const emptyForm = { code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', expiresAt: '', usageLimit: '', maxUsePerUser: '1' };

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = () => getCoupons().then((r) => setCoupons(r.data)).catch(() => {});

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      maxUsePerUser: Number(form.maxUsePerUser) || 1,
    };
    try {
      if (editing) await updateCoupon(editing, body);
      else await createCoupon(body);
      setShowForm(false); setEditing(null); setForm(emptyForm); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Operation failed'); }
  };

  const handleEdit = (c) => {
    setForm({
      code: c.code, discountType: c.discountType, discountValue: c.discountValue.toString(),
      minOrderAmount: c.minOrderAmount.toString(), maxDiscount: c.maxDiscount ? c.maxDiscount.toString() : '',
      expiresAt: new Date(c.expiresAt).toISOString().slice(0, 16), usageLimit: c.usageLimit ? c.usageLimit.toString() : '',
      maxUsePerUser: c.maxUsePerUser?.toString() || '1',
    });
    setEditing(c._id); setShowForm(true);
  };

  const handleDelete = async (id) => { if (!window.confirm('Delete this coupon?')) return; await deleteCoupon(id); fetchData(); };

  const now = new Date().toISOString().slice(0, 16);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <Seo title="Admin — Coupons" />
      <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">
          {showForm ? 'Cancel' : '+ Add coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Code *</label><input name="code" value={form.code} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select name="discountType" value={form.discountType} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="percentage">Percentage</option><option value="flat">Flat (₹)</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Value *</label><input name="discountValue" type="number" min="0" value={form.discountValue} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Min order (₹)</label><input name="minOrderAmount" type="number" min="0" value={form.minOrderAmount} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max discount (₹) — % only</label><input name="maxDiscount" type="number" min="0" value={form.maxDiscount} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Usage limit</label><input name="usageLimit" type="number" min="1" value={form.usageLimit} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max per user</label><input name="maxUsePerUser" type="number" min="1" value={form.maxUsePerUser} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Expires at *</label><input name="expiresAt" type="datetime-local" value={form.expiresAt} onChange={handleChange} required min={now} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">{editing ? 'Update' : 'Add'}</button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left p-4 text-sm font-medium text-gray-500">Code</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Type</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Value</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Min order</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Used</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Expires</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-mono text-sm font-semibold text-gray-900">{c.code}</td>
                <td className="p-4 text-sm text-gray-600">{c.discountType === 'percentage' ? '%' : '₹'}</td>
                <td className="p-4 text-sm text-gray-900">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                <td className="p-4 text-sm text-gray-600">₹{c.minOrderAmount}</td>
                <td className="p-4 text-sm text-gray-600">{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''} <span className="text-xs text-gray-400">({(c.usedBy || []).length} users)</span></td>
                <td className="p-4 text-sm text-gray-600">{new Date(c.expiresAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${c.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => handleEdit(c)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Edit</button>
                  <button onClick={() => handleDelete(c._id)} className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCoupons;
