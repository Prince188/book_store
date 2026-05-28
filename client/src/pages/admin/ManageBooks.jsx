import { useState, useEffect } from 'react';
import { getBooks, createBook, updateBook, deleteBook, getCategories } from '../../api';

const emptyForm = { title: '', author: '', publisher: '', price: '', quantity: '', category: '', description: '' };

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = () => {
    getBooks({ limit: 100 }).then((r) => setBooks(r.data.books));
    getCategories().then((r) => setCategories(r.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    try {
      if (editing) await updateBook(editing, fd);
      else await createBook(fd);
      setShowForm(false); setEditing(null); setForm(emptyForm); setImage(null); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Operation failed'); }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title, author: book.author, publisher: book.publisher || '',
      price: book.price.toString(), quantity: book.quantity.toString(),
      category: book.category?._id || '', description: book.description || '',
    });
    setEditing(book._id); setShowForm(true);
  };

  const handleDelete = async (id) => { if (!window.confirm('Delete this book?')) return; await deleteBook(id); fetchData(); };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Books</h1>
          <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">
            {showForm ? 'Cancel' : '+ Add book'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Author *</label><input name="author" value={form.author} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label><input name="publisher" value={form.publisher} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Price *</label><input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label><input name="quantity" type="number" value={form.quantity} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category *</label><select name="category" value={form.category} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">Select</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label><input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="text-sm text-gray-500" /></div>
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">{editing ? 'Update' : 'Add'}</button>
          </form>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-500">Book</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Author</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Category</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500">Price</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4"><div className="flex items-center gap-3"><img src={book.image || 'https://via.placeholder.com/40x60'} alt="" className="w-8 h-12 object-cover rounded-lg" /><span className="font-medium text-gray-900 text-sm">{book.title}</span></div></td>
                  <td className="p-4 text-sm text-gray-600">{book.author}</td>
                  <td className="p-4 text-sm text-gray-600">{book.category?.name || '-'}</td>
                  <td className="p-4 text-sm font-medium text-gray-900 text-right">${book.price}</td>
                  <td className="p-4 text-sm text-right"><span className={book.quantity > 0 ? 'text-emerald-600 font-medium' : 'text-red-500'}>{book.quantity}</span></td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleEdit(book)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDelete(book._id)} className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Delete</button>
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
