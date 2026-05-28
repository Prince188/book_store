import { useState, useEffect, useRef } from 'react';
import { getBooks, createBook, updateBook, deleteBook, getCategories, createCategory } from '../../api';
import Seo from '../../components/Seo';

const emptyForm = { title: '', author: '', publisher: '', price: '', quantity: '', categories: [], description: '' };

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchData = () => {
    getBooks({ limit: 100 }).then((r) => setBooks(r.data.books));
    getCategories().then((r) => setCategories(r.data));
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const filtered = categories
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 5);

  const handleSelectCategory = (cat) => {
    if (!form.categories.includes(cat._id)) {
      setForm((prev) => ({ ...prev, categories: [...prev.categories, cat._id] }));
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleCreateAndSelect = async () => {
    const name = searchTerm.trim();
    if (!name) return;
    const res = await createCategory({ name });
    const newCat = res.data;
    setCategories((prev) => [...prev, newCat]);
    setForm((prev) => ({ ...prev, categories: [...prev.categories, newCat._id] }));
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveCategory = (catId) => {
    setForm((prev) => ({ ...prev, categories: prev.categories.filter((id) => id !== catId) }));
  };

  const LIMITS = { title: 100, author: 80, publisher: 80, description: 500 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const field of ['title', 'author', 'publisher', 'description']) {
      if (form[field].length > LIMITS[field]) {
        alert(`${field.charAt(0).toUpperCase() + field.slice(1)} exceeds ${LIMITS[field]} characters`);
        return;
      }
    }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'categories') return;
      fd.append(k, v);
    });
    form.categories.forEach((id) => fd.append('categories', id));
    if (image) fd.append('image', image);
    try {
      if (editing) await updateBook(editing, fd);
      else await createBook(fd);
      setShowForm(false); setEditing(null); setForm(emptyForm); setImage(null);
      setSearchTerm('');
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Operation failed'); }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title, author: book.author, publisher: book.publisher || '',
      price: book.price.toString(), quantity: book.quantity.toString(),
      categories: (book.categories || []).map((c) => c._id),
      description: book.description || '',
    });
    setEditing(book._id); setShowForm(true); setSearchTerm('');
  };

  const handleDelete = async (id) => { if (!window.confirm('Delete this book?')) return; await deleteBook(id); fetchData(); };

  const catMap = {};
  categories.forEach((c) => { catMap[c._id] = c; });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <Seo title="Admin — Books" />
        <h1 className="text-2xl font-serif text-[#2A2724]">Books</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); setSearchTerm(''); }}
          className="px-4 py-2 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all">
          {showForm ? 'Cancel' : '+ Add book'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#EBE6DC] p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm text-[#6B655D] mb-1">Title *</label><input name="title" maxLength={100} value={form.title} onChange={handleChange} required className="w-full px-3 py-2 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" /><span className="text-xs text-[#A8A096] mt-0.5 block text-right">{form.title.length}/100</span></div>
            <div><label className="block text-sm text-[#6B655D] mb-1">Author *</label><input name="author" maxLength={80} value={form.author} onChange={handleChange} required className="w-full px-3 py-2 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" /><span className="text-xs text-[#A8A096] mt-0.5 block text-right">{form.author.length}/80</span></div>
            <div><label className="block text-sm text-[#6B655D] mb-1">Publisher</label><input name="publisher" maxLength={80} value={form.publisher} onChange={handleChange} className="w-full px-3 py-2 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" /><span className="text-xs text-[#A8A096] mt-0.5 block text-right">{form.publisher.length}/80</span></div>
            <div><label className="block text-sm text-[#6B655D] mb-1">Price (₹) *</label><input name="price" type="text" inputMode="decimal" value={form.price} onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d{0,2}$/.test(v)) handleChange(e); }} required className="w-full px-3 py-2 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" /></div>
            <div><label className="block text-sm text-[#6B655D] mb-1">Quantity *</label><input name="quantity" type="text" inputMode="numeric" value={form.quantity} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) handleChange(e); }} required className="w-full px-3 py-2 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" /></div>
            <div ref={dropdownRef} className="relative">
              <label className="block text-sm text-[#6B655D] mb-1">Categories</label>
              {form.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.categories.map((id) => (
                    <span key={id} className="inline-flex items-center gap-1 text-xs text-[#9C8B73] bg-[#EBE6DC]/50 px-2 py-1">
                      {catMap[id]?.name || 'Unknown'}
                      <button type="button" onClick={() => handleRemoveCategory(id)} className="text-[#A8A096] hover:text-[#6B655D]">&times;</button>
                    </span>
                  ))}
                </div>
              )}
              <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)} placeholder="Search categories..." className="w-full px-3 py-2 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" />
              {showDropdown && (
                <div className="absolute z-10 top-full mt-1 w-full bg-white border border-[#EBE6DC] shadow-lg overflow-hidden">
                  {filtered.map((c) => (
                    <button key={c._id} type="button" onClick={() => handleSelectCategory(c)} className="w-full text-left px-3 py-2 text-sm text-[#6B655D] hover:bg-[#EBE6DC]/30 hover:text-[#9C8B73] transition-colors">
                      {c.name}
                    </button>
                  ))}
                  {searchTerm.trim() && !filtered.some((c) => c.name.toLowerCase() === searchTerm.trim().toLowerCase()) && (
                    <button type="button" onClick={handleCreateAndSelect} className="w-full text-left px-3 py-2 text-sm text-[#9C8B73] bg-[#EBE6DC]/30 hover:bg-[#EBE6DC]/50 transition-colors">
                      + {searchTerm.trim()}
                    </button>
                  )}
                  {!searchTerm.trim() && filtered.length === 0 && (
                    <div className="px-3 py-2 text-sm text-[#A8A096]">Type to search or create</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div><label className="block text-sm text-[#6B655D] mb-1">Description</label><textarea name="description" maxLength={500} value={form.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" /><span className="text-xs text-[#A8A096] mt-0.5 block text-right">{form.description.length}/500</span></div>
          <div><label className="block text-sm text-[#6B655D] mb-1">Image</label><input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="text-sm text-[#6B655D]" /></div>
          <button type="submit" className="px-4 py-2 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all">{editing ? 'Update' : 'Add'}</button>
        </form>
      )}

      <div className="bg-white border border-[#EBE6DC] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EBE6DC] bg-[#FBFAF7]">
              <th className="text-left p-4 text-sm text-[#6B655D]">Book</th>
              <th className="text-left p-4 text-sm text-[#6B655D]">Author</th>
              <th className="text-left p-4 text-sm text-[#6B655D]">Categories</th>
              <th className="text-right p-4 text-sm text-[#6B655D]">Price</th>
              <th className="text-right p-4 text-sm text-[#6B655D]">Stock</th>
              <th className="text-right p-4 text-sm text-[#6B655D]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="border-b border-[#EBE6DC] hover:bg-[#FBFAF7] transition-colors">
                <td className="p-4"><div className="flex items-center gap-3"><img src={book.image || 'https://via.placeholder.com/40x60'} alt="" className="w-8 h-12 object-cover" /><span className="text-[#2A2724] text-sm">{book.title}</span></div></td>
                <td className="p-4 text-sm text-[#6B655D]">{book.author}</td>
                <td className="p-4 text-sm text-[#6B655D]">{(book.categories || []).map((c) => c?.name).join(', ') || '-'}</td>
                <td className="p-4 text-sm text-[#2A2724] text-right">₹{Number(book.price).toFixed(2)}</td>
                <td className="p-4 text-sm text-right"><span className={book.quantity > 0 ? 'text-emerald-600' : 'text-red-500'}>{book.quantity}</span></td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => handleEdit(book)} className="text-sm text-[#9C8B73] hover:text-[#8A8278] transition-colors">Edit</button>
                  <button onClick={() => handleDelete(book._id)} className="text-sm text-red-500 hover:text-red-600 transition-colors">Delete</button>
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
