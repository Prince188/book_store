import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateProfile as apiUpdateProfile, getOrders } from '../api';
import Seo from '../components/Seo';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: '',
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) getOrders().then((r) => setOrders(r.data)).catch(() => {});
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const body = { ...form };
      if (!body.password) delete body.password;
      const res = await apiUpdateProfile(body);
      login(res.data);
      setMsg('Profile updated successfully');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Seo title="My Profile" />
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-500 mt-1">{user?.email}</p>
                {user?.phone && <p className="text-gray-400 text-sm">{user.phone}</p>}
              </div>
            </div>
            <button onClick={() => setEditing(!editing)}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all">
              {editing ? 'Cancel' : 'Edit profile'}
            </button>
          </div>
        </div>

        {/* Edit Profile Form */}
        {editing && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit profile</h2>

            {msg && (
              <p className={`text-sm mb-4 ${msg === 'Profile updated successfully' ? 'text-emerald-600' : 'text-red-500'}`}>{msg}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New password (leave blank to keep current)</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50">
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>
        )}

        {/* My Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">My Orders</h2>
            <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">View all</Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm mb-4">No orders yet.</p>
              <Link to="/books" className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">Start shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <Link to={`/orders/${order._id}`} key={order._id} className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={badge(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}{order.discount > 0 && ' • Discount applied'}</p>
                    <p className="font-bold text-gray-900 text-sm">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
