import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../../api';
import Seo from '../../components/Seo';

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
    <div className="p-8">
      <Seo title="Admin — Categories" />
      <h1 className="text-2xl font-serif text-[#2A2724] mb-8">Categories</h1>

      <form onSubmit={handleAdd} className="bg-white border border-[#EBE6DC] p-6 mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm text-[#6B655D] mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-[#6B655D] mb-1">Description</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full px-3 py-2 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" />
        </div>
        <button type="submit" className="px-4 py-2 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all">Add</button>
      </form>

      <div className="bg-white border border-[#EBE6DC] overflow-hidden">
        {categories.map((cat) => (
          <div key={cat._id} className="flex items-center justify-between px-5 py-4 border-b border-[#EBE6DC] last:border-0 hover:bg-[#FBFAF7] transition-colors">
            <div>
              <p className="text-[#2A2724]">{cat.name}</p>
              <p className="text-sm text-[#6B655D]">{cat.description || '-'}</p>
            </div>
            <button onClick={() => handleDelete(cat._id)} className="text-sm text-red-500 hover:text-red-600 transition-colors">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;
