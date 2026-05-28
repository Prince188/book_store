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
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => { 
    getCategories().then((r) => setCategories(r.data)); 
  }, []);

  useEffect(() => {
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (sort) params.sort = sort;
    getBooks(params).then((r) => { 
      setBooks(r.data.books); 
      setTotal(r.data.total); 
      setPages(r.data.pages); 
    });
  }, [category, page, sort, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = {};
    if (search) p.search = search;
    if (category) p.category = category;
    if (sort) p.sort = sort;
    setSearchParams(p);
  };

  const handleCategory = (catId) => {
    const p = {};
    if (catId) p.category = catId;
    if (search) p.search = search;
    if (sort) p.sort = sort;
    setSearchParams(p);
  };

  const handleSort = (value) => {
    setSort(value);
    const p = {};
    if (value) p.sort = value;
    if (category) p.category = category;
    if (search) p.search = search;
    setSearchParams(p);
  };

  const handlePage = (p) => {
    const params = { page: p };
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setSort('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header Section */}
      <div className="bg-white border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1C1917] tracking-tight">
              All books
            </h1>
            <p className="text-[#78716C] mt-3 text-lg">
              Explore our complete collection of{' '}
              <span className="font-semibold text-[#8B5CF6]">{total}</span>{' '}
              {total === 1 ? 'title' : 'titles'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-[#E7E5E4] p-4 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or author..."
                  className="w-full pl-11 pr-4 py-2.5 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all" 
                />
              </div>
            </form>

            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                value={sort} 
                onChange={(e) => handleSort(e.target.value)}
                className="w-full lg:w-48 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-2.5 text-sm text-[#57534E] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all cursor-pointer appearance-none"
              >
                <option value="">Sort: Latest</option>
                <option value="price_asc">Price: Low to high</option>
                <option value="price_desc">Price: High to low</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="name_desc">Name: Z-A</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Clear Filters Button */}
            {(search || category || sort) && (
              <button 
                onClick={clearFilters}
                className="px-4 py-2.5 text-sm font-medium text-[#78716C] hover:text-[#8B5CF6] transition-colors"
              >
                Clear all
              </button>
            )}

            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl text-sm font-medium text-[#57534E]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Categories
            </button>
          </div>
        </div>

        {/* Categories - Desktop */}
        <div className="hidden lg:block mb-8">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleCategory('')}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                !category 
                  ? 'bg-[#1C1917] text-white shadow-sm' 
                  : 'bg-white border border-[#E7E5E4] text-[#57534E] hover:border-[#8B5CF6] hover:text-[#8B5CF6]'
              }`}>
              All books
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id} 
                onClick={() => handleCategory(cat._id)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap ${
                  category === cat._id 
                    ? 'bg-[#1C1917] text-white shadow-sm' 
                    : 'bg-white border border-[#E7E5E4] text-[#57534E] hover:border-[#8B5CF6] hover:text-[#8B5CF6]'
                }`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories - Mobile Dropdown */}
        {isFilterOpen && (
          <div className="lg:hidden mb-8 bg-white rounded-2xl border border-[#E7E5E4] p-4 shadow-sm animate-slideDown">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => {
                  handleCategory('');
                  setIsFilterOpen(false);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  !category 
                    ? 'bg-[#1C1917] text-white' 
                    : 'bg-[#FAFAF9] border border-[#E7E5E4] text-[#57534E]'
                }`}>
                All books
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat._id} 
                  onClick={() => {
                    handleCategory(cat._id);
                    setIsFilterOpen(false);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                    category === cat._id 
                      ? 'bg-[#1C1917] text-white' 
                      : 'bg-[#FAFAF9] border border-[#E7E5E4] text-[#57534E]'
                  }`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(category || search || sort) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {category && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F3E8FF] text-[#8B5CF6] text-xs font-medium rounded-full">
                Category: {categories.find(c => c._id === category)?.name}
                <button onClick={() => handleCategory('')} className="hover:text-[#7C3AED]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E0F2FE] text-[#0284C7] text-xs font-medium rounded-full">
                Search: {search}
                <button onClick={() => {
                  setSearch('');
                  handleSearch({ preventDefault: () => {} });
                }} className="hover:text-[#0369A1]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {sort && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-medium rounded-full">
                Sort: {sort === 'price_asc' ? 'Price ↑' : sort === 'price_desc' ? 'Price ↓' : sort === 'name_asc' ? 'A-Z' : 'Z-A'}
                <button onClick={() => handleSort('')} className="hover:text-[#B45309]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-[#78716C]">
            Showing <span className="font-medium text-[#1C1917]">{books.length}</span> of{' '}
            <span className="font-medium text-[#1C1917]">{total}</span> books
          </p>
        </div>

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#FAFAF9] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-[#A8A29E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#1C1917] mb-2">No books found</h3>
            <p className="text-[#78716C] mb-4">Try adjusting your search or filter criteria</p>
            <button 
              onClick={clearFilters}
              className="px-5 py-2 bg-[#1C1917] text-white text-sm font-medium rounded-xl hover:bg-[#292524] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              className={`w-10 h-10 text-sm font-medium rounded-xl transition-all ${
                page === 1
                  ? 'bg-[#FAFAF9] border border-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
                  : 'bg-white border border-[#E7E5E4] text-[#57534E] hover:border-[#8B5CF6] hover:text-[#8B5CF6]'
              }`}
            >
              ←
            </button>
            
            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
              let pageNum;
              if (pages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= pages - 2) {
                pageNum = pages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button 
                  key={pageNum} 
                  onClick={() => handlePage(pageNum)}
                  className={`w-10 h-10 text-sm font-medium rounded-xl transition-all ${
                    page === pageNum 
                      ? 'bg-[#1C1917] text-white shadow-sm' 
                      : 'bg-white border border-[#E7E5E4] text-[#57534E] hover:border-[#8B5CF6] hover:text-[#8B5CF6]'
                  }`}>
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === pages}
              className={`w-10 h-10 text-sm font-medium rounded-xl transition-all ${
                page === pages
                  ? 'bg-[#FAFAF9] border border-[#E7E5E4] text-[#A8A29E] cursor-not-allowed'
                  : 'bg-white border border-[#E7E5E4] text-[#57534E] hover:border-[#8B5CF6] hover:text-[#8B5CF6]'
              }`}
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
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
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AllBooks;