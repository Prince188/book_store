import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    relative px-3 py-2 text-sm font-medium transition-all duration-300
    ${isActive(path)
      ? 'text-amber-600'
      : 'text-gray-700 hover:text-amber-600'
    }
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 
    after:bg-amber-600 after:transform after:scale-x-0 after:transition-transform after:duration-300
    hover:after:scale-x-100
    ${isActive(path) ? 'after:scale-x-100' : ''}
  `;

  return (
    <nav className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border-b border-amber-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
          >
            <span className="text-3xl filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
              📚
            </span>
            <span className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-800 to-amber-600 bg-clip-text text-transparent">
              BookStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/books" className={navLinkClass('/books')}>Books</Link>
            <Link to="/cart" className={navLinkClass('/cart')}>
              <span className="flex items-center space-x-1">
                <span>🛒</span>
                <span>Cart</span>
              </span>
            </Link>
            <Link to="/favorites" className={navLinkClass('/favorites')}>
              <span className="flex items-center space-x-1">
                <span>❤️</span>
                <span>Favorites</span>
              </span>
            </Link>
            {user && (
              <Link to="/orders" className={navLinkClass('/orders')}>
                Orders
              </Link>
            )}
          </div>

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <div className="hidden md:flex items-center space-x-1 ml-4 pl-4 border-l border-amber-200">
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                Admin
              </span>
              <Link to="/admin" className={navLinkClass('/admin')}>Dashboard</Link>
              <Link to="/admin/books" className={navLinkClass('/admin/books')}>Books</Link>
              <Link to="/admin/categories" className={navLinkClass('/admin/categories')}>Categories</Link>
              <Link to="/admin/orders" className={navLinkClass('/admin/orders')}>Orders</Link>
            </div>
          )}

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-amber-100 px-3 py-1.5 rounded-full">
                  <span className="text-amber-600">👤</span>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 text-sm font-medium text-red-600 hover:text-white 
                           border border-red-600 hover:bg-red-600 rounded-full 
                           transition-all duration-300 hover:shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-1.5 text-sm font-medium text-white bg-gradient-to-r 
                         from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 
                         rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-amber-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-200 animate-slideDown">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/books" className="px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Books</Link>
              <Link to="/cart" className="px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Cart 🛒</Link>
              <Link to="/favorites" className="px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Favorites ❤️</Link>
              {user && <Link to="/orders" className="px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>}

              {user?.role === 'admin' && (
                <>
                  <div className="h-px bg-amber-200 my-2"></div>
                  <span className="px-3 text-xs font-semibold text-amber-700">Admin Panel</span>
                  <Link to="/admin" className="px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/admin/books" className="px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Manage Books</Link>
                  <Link to="/admin/categories" className="px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
                  <Link to="/admin/orders" className="px-3 py-2 text-gray-700 hover:bg-amber-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Manage Orders</Link>
                </>
              )}

              <div className="h-px bg-amber-200 my-2"></div>
              {user ? (
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">👤 {user.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="mx-3 px-4 py-2 text-center text-white bg-gradient-to-r from-amber-600 to-amber-700 rounded-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

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
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;