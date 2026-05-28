import { useState, useEffect, useContext } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api';
import { ToastContext } from '../context/ToastContext';
import Seo from '../components/Seo';

const ManageCategories = () => {
  const { addToast } = useContext(ToastContext);
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);

  const load = () => { getCategories().then((r) => setCats(r.data)).catch(() => {}); };
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editing) {
        await updateCategory(editing, { name });
        addToast('Category updated');
      } else {
        await createCategory({ name });
        addToast('Category created');
      }
      setName(''); setEditing(null);
      load();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await deleteCategory(id); addToast('Category deleted'); load(); }
    catch (err) { addToast('Failed to delete', 'error'); }
  };

  return (
    <div>
      <Seo title="Manage Categories" />
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Organization</p>
        <h1 className="text-3xl font-serif font-semibold text-gray-900 mt-2">Categories</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">{editing ? 'Edit category' : 'New category'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Category name"
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-semibold hover:bg-indigo-700 transition-all">
            {editing ? 'Update' : 'Create'}
          </button>
          {editing && (
            <button type="button" onClick={() => { setName(''); setEditing(null); }}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded text-sm font-medium hover:bg-gray-50 transition-all">
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Name</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-gray-900">{c.name}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => { setName(c.name); setEditing(c._id); }}
                      className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold mr-3">Edit</button>
                    <button onClick={() => handleDelete(c._id)}
                      className="text-red-500 hover:text-red-600 text-xs font-semibold">Delete</button>
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

export default ManageCategories;
