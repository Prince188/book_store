import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getBooks, getCategories } from '../api';
import BookCard from '../components/BookCard';
import Seo from '../components/Seo';

const AllBooks = () => {
  const [params] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(Number(params.get('page')) || 1);
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    category: params.get('category') || '',
    sort: params.get('sort') || '-createdAt',
  });
  const [priceRange, setPriceRange] = useState([0, 5000]);

  useEffect(() => { getCategories().then((r) => setCategories(r.data)); }, []);

  useEffect(() => {
    const query = { ...filters, page, minPrice: priceRange[0], maxPrice: priceRange[1] };
    Object.keys(query).forEach((k) => (query[k] === '' || query[k] === undefined) && delete query[k]);
    getBooks(query).then((r) => { setBooks(r.data.books); setTotalPages(r.data.totalPages); });
  }, [filters, page, priceRange]);

  const handleFilter = (key, val) => { setFilters((p) => ({ ...p, [key]: val })); setPage(1); };

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="All Books" description="Browse our complete collection of books across all genres and categories." />

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Browse</p>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mt-2">All books</h1>
          </div>
          <p className="text-sm text-gray-500">{books.length} result{books.length !== 1 && 's'}</p>
        </div>

        {/* Search + filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Search</label>
              <input type="text" value={filters.search} onChange={(e) => handleFilter('search', e.target.value)}
                placeholder="Title or author..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
              <select value={filters.category} onChange={(e) => handleFilter('category', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Sort by</label>
              <select value={filters.sort} onChange={(e) => handleFilter('sort', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low &rarr; High</option>
                <option value="-price">Price: High &rarr; Low</option>
                <option value="title">Title A&ndash;Z</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Max price</label>
              <input type="range" min="0" max="5000" step="100" value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-indigo-600 mt-1" />
              <span className="text-sm text-gray-400">&le; &curren;{priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Books grid */}
        {books.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">No books found</p>
            <Link to="/books" className="text-sm text-indigo-600 hover:text-indigo-700 mt-2 inline-block font-medium">Clear all filters</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {books.map((book) => <BookCard key={book._id} book={book} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all">
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBooks;
