import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks, getCategories } from '../api';
import BookCard from '../components/BookCard';

const AllBooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('');

  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (sort) params.sort = sort;
    getBooks(params).then((res) => {
      setBooks(res.data.books);
      setTotal(res.data.total);
      setPages(res.data.pages);
    });
  }, [category, page, sort, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    setSearchParams(params);
  };

  const handleCategory = (catId) => {
    const params = {};
    if (catId) params.category = catId;
    if (search) params.search = search;
    setSearchParams(params);
  };

  const handlePage = (p) => {
    const params = { page: p };
    if (category) params.category = category;
    if (search) params.search = search;
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Books</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author..."
            className="border rounded-lg px-4 py-2 w-72"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Search
          </button>
        </form>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-lg px-4 py-2">
          <option value="">Sort by: Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A-Z</option>
          <option value="name_desc">Name: Z-A</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleCategory('')}
          className={`px-4 py-1.5 rounded-full text-sm ${!category ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategory(cat._id)}
            className={`px-4 py-1.5 rounded-full text-sm ${category === cat._id ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <p className="text-gray-500 mb-4">{total} books found</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePage(p)}
              className={`px-4 py-2 rounded ${page === p ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
