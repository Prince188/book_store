import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../../api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const fetchData = () => getCategories().then((r) => setCategories(r.data));
  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try { await createCategory({ name, description: desc }); setName(''); setDesc(''); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => { if (!window.confirm('Delete this category?')) return; await deleteCategory(id); fetchData(); };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">Add</button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{cat.name}</p>
                <p className="text-sm text-gray-500">{cat.description || '-'}</p>
              </div>
              <button onClick={() => handleDelete(cat._id)} className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
