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
    getBooks({ limit: 100 }).then((res) => setBooks(res.data.books));
    getCategories().then((res) => setCategories(res.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);

    try {
      if (editing) {
        await updateBook(editing, fd);
      } else {
        await createBook(fd);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      setImage(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher || '',
      price: book.price.toString(),
      quantity: book.quantity.toString(),
      category: book.category?._id || '',
      description: book.description || '',
    });
    setEditing(book._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    await deleteBook(id);
    fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Books</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          {showForm ? 'Cancel' : '+ Add Book'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-8 border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Author *</label>
              <input name="author" value={form.author} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Publisher</label>
              <input name="publisher" value={form.publisher} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Price *</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Quantity *</label>
              <input name="quantity" type="number" value={form.quantity} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            {editing ? 'Update Book' : 'Add Book'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3">Image</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Author</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <img src={book.image || 'https://via.placeholder.com/40x60'} alt="" className="w-10 h-14 object-cover rounded" />
                </td>
                <td className="p-3 font-medium">{book.title}</td>
                <td className="p-3 text-gray-600">{book.author}</td>
                <td className="p-3">{book.category?.name || '-'}</td>
                <td className="p-3 font-bold">${book.price}</td>
                <td className="p-3">
                  <span className={`${book.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>{book.quantity}</span>
                </td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(book)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">Edit</button>
                  <button onClick={() => handleDelete(book._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBooks;
