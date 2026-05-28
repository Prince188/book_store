import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#FBFAF7]/90 backdrop-blur-md border-b border-[#EBE6DC]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-serif font-normal tracking-tight text-[#2A2724]"
          >
            Bookstore
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/books"
                className="text-[#6B655D] hover:text-[#9C8B73] transition-colors duration-200"
              >
                Books
              </Link>
              <Link
                to="/cart"
                className="text-[#6B655D] hover:text-[#9C8B73] transition-colors duration-200"
              >
                Cart
              </Link>
              <Link
                to="/favorites"
                className="text-[#6B655D] hover:text-[#9C8B73] transition-colors duration-200"
              >
                Favorites
              </Link>
              <Link
                to="/contact"
                className="text-[#6B655D] hover:text-[#9C8B73] transition-colors duration-200"
              >
                Contact
              </Link>
              {user && (
                <Link
                  to="/orders"
                  className="text-[#6B655D] hover:text-[#9C8B73] transition-colors duration-200"
                >
                  Orders
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-[#9C8B73] hover:text-[#8A8278] transition-colors duration-200"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-[#EBE6DC]">
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm text-[#6B655D] hover:text-[#2A2724] transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#9C8B73] to-[#C9B79C] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:inline">{user.name?.split(' ')[0]}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EBE6DC] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-[#6B655D] hover:bg-[#EBE6DC]/30 hover:text-[#9C8B73] transition-colors"
                      >
                        Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <>
                          <Link to="/admin/users" className="block px-4 py-2 text-sm text-[#6B655D] hover:bg-[#EBE6DC]/30 hover:text-[#9C8B73] transition-colors">Users</Link>
                          <Link to="/admin/tickets" className="block px-4 py-2 text-sm text-[#6B655D] hover:bg-[#EBE6DC]/30 hover:text-[#9C8B73] transition-colors">Tickets</Link>
                        </>
                      )}
                      <hr className="my-1 border-[#EBE6DC]" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-[#EBE6DC]/30 transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm text-[#6B655D] hover:text-[#9C8B73] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-[#2A2724] text-white text-sm rounded-xl hover:bg-[#6B655D] shadow-sm transition-all duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#EBE6DC]/30 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-[#6B655D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-[#FBFAF7]/95 backdrop-blur-lg border-b border-[#EBE6DC] shadow-lg animate-slideDown">
          <div className="px-6 py-4 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-3">
              <Link
                to="/books"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-[#6B655D] hover:text-[#9C8B73] transition-colors py-2"
              >
                Books
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-[#6B655D] hover:text-[#9C8B73] transition-colors py-2"
              >
                Cart
              </Link>
              <Link
                to="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-[#6B655D] hover:text-[#9C8B73] transition-colors py-2"
              >
                Favorites
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-[#6B655D] hover:text-[#9C8B73] transition-colors py-2"
              >
                Contact
              </Link>
              {user && (
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#6B655D] hover:text-[#9C8B73] transition-colors py-2"
                >
                  Orders
                </Link>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-[#9C8B73] hover:text-[#8A8278] transition-colors py-2">Dashboard</Link>
                  <Link to="/admin/books" onClick={() => setIsMobileMenuOpen(false)} className="block text-[#6B655D] hover:text-[#9C8B73] transition-colors py-2 pl-4 text-sm">Books</Link>
                  <Link to="/admin/categories" onClick={() => setIsMobileMenuOpen(false)} className="block text-[#6B655D] hover:text-[#9C8B73] transition-colors py-2 pl-4 text-sm">Categories</Link>
                  <Link to="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} className="block text-[#6B655D] hover:text-[#9C8B73] transition-colors py-2 pl-4 text-sm">Orders</Link>
                  <Link to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className="block text-[#6B655D] hover:text-[#9C8B73] transition-colors py-2 pl-4 text-sm">Users</Link>
                  <Link to="/admin/tickets" onClick={() => setIsMobileMenuOpen(false)} className="block text-[#6B655D] hover:text-[#9C8B73] transition-colors py-2 pl-4 text-sm">Tickets</Link>
                </>
              )}
            </div>

            <hr className="border-[#EBE6DC]" />

            {/* Auth Section Mobile */}
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#9C8B73] to-[#C9B79C] rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm text-[#2A2724]">{user.name}</p>
                    <p className="text-xs text-[#A8A096]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-[#EF4444] hover:bg-[#EBE6DC]/30 rounded-lg transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-5 py-2.5 text-sm text-[#6B655D] hover:text-[#9C8B73] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-5 py-2.5 bg-[#2A2724] text-white text-sm rounded-xl hover:bg-[#6B655D] transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
