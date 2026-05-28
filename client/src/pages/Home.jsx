import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBooks, getCategories } from '../api';
import BookCard from '../components/BookCard';
import Seo from '../components/Seo';

const Home = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    getBooks({ limit: 8 }).then((r) => setFeatured(r.data.books));
    getCategories().then((r) => setCategories(r.data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/books?search=${encodeURIComponent(searchVal)}`);
  };

  return (
    <div className="bg-[#FAFAF9] min-h-screen">
      <Seo description="Browse our collection of books across all genres. Find your next great read at Bookstore." />
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#F3E8FF] rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#E0F2FE] rounded-full blur-3xl opacity-40" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#E7E5E4] px-4 py-2 rounded-full mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full" />
            <span className="text-xs font-medium text-[#57534E]">Curated Collection</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1C1917] leading-[1.15]">
            Discover stories that{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
              speak to you
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-[#78716C] max-w-2xl mx-auto leading-relaxed">
            Explore a thoughtfully curated collection of books, from timeless classics to modern masterpieces.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
            <div className="relative group">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search by title, author, or genre..."
                className="w-full px-6 py-4 bg-white border border-[#E7E5E4] rounded-2xl text-[#1C1917] placeholder:text-[#A8A29E] text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#1C1917] text-white text-sm font-medium rounded-xl hover:bg-[#292524] transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-[#A8A29E]">Popular:</span>
            {['Fiction', 'Science', 'History', 'Philosophy', 'Art'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/books?search=${tag}`)}
                className="px-4 py-1.5 bg-white border border-[#E7E5E4] rounded-full text-[#57534E] hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-all duration-200 text-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="px-6 py-12 border-t border-[#E7E5E4] bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#1C1917]">Browse by category</h2>
                <p className="text-sm text-[#78716C] mt-1">Find exactly what you're looking for</p>
              </div>
              <Link
                to="/books"
                className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
              >
                View all categories →
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/books?category=${cat._id}`}
                  className="px-5 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-sm font-medium text-[#57534E] hover:border-[#8B5CF6] hover:text-[#8B5CF6] hover:shadow-sm transition-all duration-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Books Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-wider">Featured</span>
              <h2 className="text-3xl font-bold text-[#1C1917] mt-2">Editors' pick</h2>
              <p className="text-[#78716C] mt-1">Hand-selected books you don't want to miss</p>
            </div>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-sm font-medium text-[#57534E] hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-all duration-200"
            >
              Browse all books
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {featured.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1C1917]">Designed for book lovers</h2>
            <p className="text-[#78716C] mt-2">Everything you need for a seamless reading journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 bg-[#FAFAF9] rounded-2xl border border-[#E7E5E4] hover:border-[#8B5CF6]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1C1917] mb-2">Curated quality</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">
                Every book in our collection is hand-picked by our team of literary experts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-[#FAFAF9] rounded-2xl border border-[#E7E5E4] hover:border-[#8B5CF6]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1C1917] mb-2">Fast delivery</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">
                Free shipping on orders over ₹50. Track your package every step of the way.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-[#FAFAF9] rounded-2xl border border-[#E7E5E4] hover:border-[#8B5CF6]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1C1917] mb-2">Secure payments</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">
                Shop with confidence using our encrypted and secure checkout system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-[#FAFAF9] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#E7E5E4] shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#1C1917] mb-2">Stay in the loop</h3>
            <p className="text-[#78716C] mb-6">Get book recommendations and exclusive offers straight to your inbox</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all"
              />
              <button className="px-6 py-3 bg-[#1C1917] text-white text-sm font-medium rounded-xl hover:bg-[#292524] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;