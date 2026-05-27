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
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      const params = { page, limit: 12 };
      if (category) params.category = category;
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (sort) params.sort = sort;

      try {
        const res = await getBooks(params);
        setBooks(res.data.books);
        setTotal(res.data.total);
        setPages(res.data.pages);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
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
    setIsFilterOpen(false);
  };

  const handlePage = (p) => {
    const params = { page: p };
    if (category) params.category = category;
    if (search) params.search = search;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch('');
    setSort('');
    setSearchParams({});
  };

  const sortOptions = [
    { value: '', label: 'Latest Arrivals' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Title: A to Z' },
    { value: 'name_desc', label: 'Title: Z to A' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-amber-800 to-stone-800 text-white py-12 mb-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
            Explore Our Collection
          </h1>
          <p className="text-amber-100 text-lg">
            Discover thousands of books across all genres
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, author, or ISBN..."
                  className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white cursor-pointer"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden px-4 py-3 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>

            {/* Clear Filters Button */}
            {(search || category || sort) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-amber-700 hover:text-amber-800 font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories - Desktop */}
          <div className="hidden lg:block mt-4 overflow-x-auto">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!category
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-amber-50 text-stone-700 hover:bg-amber-100'
                  }`}
              >
                All Books
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategory(cat._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${category === cat._id
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-amber-50 text-stone-700 hover:bg-amber-100'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories - Mobile Dropdown */}
        {isFilterOpen && (
          <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-amber-100 p-4 mb-8 animate-slideDown">
            <h3 className="font-semibold text-stone-800 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!category ? 'bg-amber-600 text-white' : 'bg-amber-50 text-stone-700'
                  }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategory(cat._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat._id ? 'bg-amber-600 text-white' : 'bg-amber-50 text-stone-700'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <p className="text-stone-600">
              Showing <span className="font-semibold text-stone-800">{books.length}</span> of{' '}
              <span className="font-semibold text-stone-800">{total}</span> books
            </p>
          </div>
          {category && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">Category:</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {categories.find(c => c._id === category)?.name || category}
              </span>
            </div>
          )}
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-amber-100 rounded-2xl h-64 mb-3"></div>
                <div className="h-4 bg-amber-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-amber-50 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-amber-50 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book, index) => (
                <div
                  key={book._id}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg transition-all ${page === 1
                      ? 'bg-amber-50 text-stone-300 cursor-not-allowed'
                      : 'bg-white border border-amber-200 text-stone-700 hover:bg-amber-50'
                    }`}
                >
                  ← Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                    let pageNum;
                    if (pages <= 7) {
                      pageNum = i + 1;
                    } else if (page <= 4) {
                      pageNum = i + 1;
                      if (i === 6) pageNum = pages;
                    } else if (page >= pages - 3) {
                      pageNum = pages - 6 + i;
                    } else {
                      pageNum = page - 3 + i;
                    }

                    if (pageNum > pages) return null;
                    if (i === 5 && pages > 7 && page < pages - 3) {
                      return <span key="ellipsis" className="px-3 py-2">...</span>;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${page === pageNum
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'bg-white border border-amber-200 text-stone-700 hover:bg-amber-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={page === pages}
                  className={`px-4 py-2 rounded-lg transition-all ${page === pages
                      ? 'bg-amber-50 text-stone-300 cursor-not-allowed'
                      : 'bg-white border border-amber-200 text-stone-700 hover:bg-amber-50'
                    }`}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-amber-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">No books found</h3>
            <p className="text-stone-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AllBooks;