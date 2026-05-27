import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, getCategories } from '../api';
import BookCard from '../components/BookCard';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [booksRes, categoriesRes] = await Promise.all([
          getBooks({ limit: 8 }),
          getCategories()
        ]);
        setFeatured(booksRes.data.books);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-stone-800 text-white">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-800/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-2xl">📖</span>
              <span className="text-sm font-medium">Since 2024</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                BookStore
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 mb-10 leading-relaxed">
              Discover your next favorite read among thousands of books
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/books"
                className="group inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span>Browse All Books</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/favorites"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                <span>❤️</span>
                <span>My Favorites</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-amber-50/10" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="currentColor">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-3">
              Explore Categories
            </h2>
            <p className="text-stone-600">Find books that match your interests</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, index) => (
              <Link
                key={cat._id}
                to={`/books?category=${cat._id}`}
                className="group relative overflow-hidden bg-white border border-amber-200 px-6 py-2.5 rounded-full 
                         hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards',
                  opacity: 0
                }}
              >
                <span className="relative z-10 text-stone-700 group-hover:text-amber-700 font-medium transition-colors">
                  {cat.name}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-amber-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Books Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-2">
              Featured Books
            </h2>
            <p className="text-stone-600">Hand-picked selections just for you</p>
          </div>
          <Link
            to="/books"
            className="group inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium transition-colors"
          >
            <span>View All Books</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-amber-100 rounded-2xl h-64 mb-3"></div>
                <div className="h-4 bg-amber-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-amber-50 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((book, index) => (
              <div
                key={book._id}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-amber-100">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-stone-500">No books found</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-t border-amber-200 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3">
            Join Our Book Community
          </h3>
          <p className="text-stone-600 mb-6">
            Get exclusive offers, reading recommendations, and updates straight to your inbox
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-stone-500 mt-4">No spam, unsubscribe anytime.</p>
        </div>
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
      `}</style>
    </div>
  );
};

export default Home;