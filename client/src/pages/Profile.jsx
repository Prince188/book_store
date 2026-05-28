import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import Seo from '../components/Seo';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      addToast('Profile updated');
      setForm((p) => ({ ...p, password: '' }));
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="My Profile" />
      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-serif font-semibold text-gray-900 mb-2">My Profile</h1>
          <p className="text-sm text-gray-500 mb-8">Update your account information</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New password <span className="text-gray-400 font-normal">(leave blank to keep current)</span>
              </label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
