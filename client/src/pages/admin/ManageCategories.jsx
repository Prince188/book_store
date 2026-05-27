import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../../api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const fetchData = () => getCategories().then((res) => setCategories(res.data));

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createCategory({ name, description: desc });
      setName('');
      setDesc('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await deleteCategory(id);
    fetchData();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

      <form onSubmit={handleAdd} className="bg-gray-50 rounded-xl p-6 mb-8 border flex gap-4 items-end">
        <div className="flex-1">
          <label className="block font-medium mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1">Description</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 h-fit">Add</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Description</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3 text-gray-600">{cat.description || '-'}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(cat._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;
