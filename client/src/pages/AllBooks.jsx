import { useState, useEffect, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    category: params.get('category') || '',
    sort: params.get('sort') || '-createdAt',
  });
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 5000]);

  useEffect(() => { 
    getCategories().then((r) => setCategories(r.data)); 
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const query = { ...filters, page, minPrice: priceRange[0], maxPrice: priceRange[1] };
      Object.keys(query).forEach((k) => (query[k] === '' || query[k] === undefined) && delete query[k]);
      try {
        const r = await getBooks(query);
        setBooks(r.data.books);
        setTotalPages(r.data.totalPages);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [filters, page, priceRange]);

  const handleFilter = (key, val) => { 
    setFilters((p) => ({ ...p, [key]: val })); 
    setPage(1); 
  };

  const handlePriceApply = () => {
    setPriceRange(tempPriceRange);
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters({ search: '', category: '', sort: '-createdAt' });
    setPriceRange([0, 5000]);
    setTempPriceRange([0, 5000]);
    setPage(1);
  };

  const hasActiveFilters = filters.search || filters.category || priceRange[1] < 5000;

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First', icon: 'M12 8v4l3 3M12 8v4m0 0l-3 3m3-3l3-3' },
    { value: 'price', label: 'Price: Low to High', icon: 'M3 4h13M3 8h9m-9 4h6' },
    { value: '-price', label: 'Price: High to Low', icon: 'M3 4h13M3 8h9m-9 4h6' },
    { value: 'title', label: 'Title A-Z', icon: 'M4 4h16M4 8h10M4 12h6M4 16h16' },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === filters.sort);
    return option ? option.label : 'Sort by';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50/20">
      <Seo title="All Books" description="Browse our complete collection of books across all genres and categories." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-0.5 bg-indigo-400 rounded-full"></div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Browse Collection</p>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900">
              All Books
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Discover your next great read from our curated collection
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-indigo-600">{books.length}</span> {books.length === 1 ? 'book' : 'books'}
              </span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Section - Desktop & Mobile Toggle */}
        <div className={`${showFilters ? 'block' : 'hidden lg:block'} mb-8 transition-all duration-300`}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 lg:p-6 space-y-5">
              
              {/* Search & Sort Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={filters.search} 
                      onChange={(e) => handleFilter('search', e.target.value)}
                      placeholder="Search by title, author..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pl-10"
                    />
                    <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {filters.search && (
                      <button
                        onClick={() => handleFilter('search', '')}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                    Category
                  </label>
                  <select 
                    value={filters.category} 
                    onChange={(e) => handleFilter('category', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Sort by
                  </label>
                  <select 
                    value={filters.sort} 
                    onChange={(e) => handleFilter('sort', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range Section */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Price Range
                      </label>
                      <span className="text-sm font-semibold text-indigo-600">
                        Up to ₹{tempPriceRange[1].toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="5000" 
                      step="100" 
                      value={tempPriceRange[1]}
                      onChange={(e) => setTempPriceRange([0, Number(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>₹0</span>
                      <span>₹1,000</span>
                      <span>₹2,000</span>
                      <span>₹3,000</span>
                      <span>₹4,000</span>
                      <span>₹5,000+</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {tempPriceRange[1] !== priceRange[1] && (
                      <button
                        onClick={handlePriceApply}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all"
                      >
                        Apply
                      </button>
                    )}
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                      Search: {filters.search}
                      <button onClick={() => handleFilter('search', '')} className="hover:text-indigo-900">×</button>
                    </span>
                  )}
                  {filters.category && categories.find(c => c._id === filters.category) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                      Category: {categories.find(c => c._id === filters.category)?.name}
                      <button onClick={() => handleFilter('category', '')} className="hover:text-indigo-900">×</button>
                    </span>
                  )}
                  {priceRange[1] < 5000 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                      Max Price: ₹{priceRange[1].toLocaleString('en-IN')}
                      <button onClick={() => { setPriceRange([0, 5000]); setTempPriceRange([0, 5000]); setPage(1); }} className="hover:text-indigo-900">×</button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl aspect-[2/3] mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 lg:py-24">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No books found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 lg:mt-16">
                <button 
                  disabled={page <= 1} 
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                            page === pageNum
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <button 
                  disabled={page >= totalPages} 
                  onClick={() => setPage((p) => p + 1)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllBooks;