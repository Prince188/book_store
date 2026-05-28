import { useState, useEffect, useContext } from 'react';
import { getBooks, createBook, updateBook, deleteBook, getCategories, uploadImage } from '../api';
import { ToastContext } from '../context/ToastContext';
import Seo from '../components/Seo';

const empty = { title: '', author: '', publisher: '', description: '', price: '', originalPrice: '', stock: '', categories: [], image: '' };

const ManageBooks = () => {
  const { addToast } = useContext(ToastContext);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([getBooks({ limit: 200 }), getCategories()])
      .then(([b, c]) => { setBooks(b.data.books); setCategories(c.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (form.originalPrice) payload.originalPrice = Number(form.originalPrice);
    else delete payload.originalPrice;

    try {
      if (editing) {
        await updateBook(editing, payload);
        addToast('Book updated');
      } else {
        await createBook(payload);
        addToast('Book created');
      }
      setForm(empty); setEditing(null); setShowForm(false);
      load();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error');
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title || '',
      author: book.author || '',
      publisher: book.publisher || '',
      description: book.description || '',
      price: book.price?.toString() || '',
      originalPrice: book.originalPrice?.toString() || '',
      stock: book.stock?.toString() || '',
      categories: book.categories?.map((c) => c._id || c) || [],
      image: book.image || '',
    });
    setEditing(book._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try { await deleteBook(id); addToast('Book deleted'); load(); }
    catch (err) { addToast('Failed to delete', 'error'); }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await uploadImage(file);
      setForm((p) => ({ ...p, image: data.url }));
      addToast('Image uploaded');
    } catch (err) {
      addToast('Upload failed', 'error');
    }
  };

  const toggleCategory = (catId) => {
    setForm((p) => ({
      ...p,
      categories: p.categories.includes(catId) ? p.categories.filter((c) => c !== catId) : [...p.categories, catId],
    }));
  };

  const filtered = books.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Seo title="Manage Books" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Catalog</p>
          <h1 className="text-3xl font-serif font-semibold text-gray-900 mt-2">Books</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all">
          {showForm ? 'Cancel' : 'Add book'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-6">{editing ? 'Edit book' : 'New book'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={100}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required maxLength={80}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                <input value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} maxLength={80}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (&curren;) *</label>
                <input value={form.price} onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setForm({ ...form, price: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original price</label>
                <input value={form.originalPrice} onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setForm({ ...form, originalPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input value={form.stock} onChange={(e) => /^\d*$/.test(e.target.value) && setForm({ ...form, stock: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} rows={3}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button key={c._id} type="button" onClick={() => toggleCategory(c._id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                      form.categories.includes(c._id) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleImage}
                  className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 file:text-xs file:font-semibold hover:file:bg-indigo-100" />
                {form.image && <img src={form.image} alt="" className="h-10 w-8 object-cover rounded" />}
              </div>
            </div>
            <button type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all">
              {editing ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books..."
            className="w-full max-w-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Author</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Stock</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-gray-900 max-w-[200px] truncate">{b.title}</td>
                  <td className="py-3 px-4 text-gray-600">{b.author}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">&curren;{b.price?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right"><span className={`text-xs font-medium ${b.stock > 10 ? 'text-green-600' : b.stock > 0 ? 'text-yellow-600' : 'text-red-500'}`}>{b.stock}</span></td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleEdit(b)} className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold mr-3">Edit</button>
                    <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:text-red-600 text-xs font-semibold">Delete</button>
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

export default ManageBooks;
