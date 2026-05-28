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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-serif font-semibold text-gray-900 tracking-tight">
          Bookstore
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/books" className="hover:text-indigo-600 transition-colors">Books</Link>
            <Link to="/cart" className="hover:text-indigo-600 transition-colors">Cart</Link>
            <Link to="/favorites" className="hover:text-indigo-600 transition-colors">Favorites</Link>
            <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
            {user && <Link to="/orders" className="hover:text-indigo-600 transition-colors">Orders</Link>}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-indigo-600 hover:text-indigo-700 transition-colors font-semibold">Admin</Link>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:inline">{user.name?.split(' ')[0]}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">Profile</Link>
                    {user?.role === 'admin' && (
                      <>
                        <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">Users</Link>
                        <Link to="/admin/tickets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">Tickets</Link>
                      </>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors">Log out</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Log in</Link>
              <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all">Sign up</Link>
            </div>
          )}
        </div>

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-6 py-4 space-y-3">
            <Link to="/books" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 hover:text-indigo-600 font-medium py-1">Books</Link>
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 hover:text-indigo-600 font-medium py-1">Cart</Link>
            <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 hover:text-indigo-600 font-medium py-1">Favorites</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 hover:text-indigo-600 font-medium py-1">Contact</Link>
            {user && <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 hover:text-indigo-600 font-medium py-1">Orders</Link>}
            {user?.role === 'admin' && (
              <div className="pl-4 space-y-1 border-l-2 border-indigo-200">
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-indigo-600 font-semibold py-1">Dashboard</Link>
                <Link to="/admin/books" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-500 hover:text-indigo-600 text-sm py-0.5">Books</Link>
                <Link to="/admin/categories" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-500 hover:text-indigo-600 text-sm py-0.5">Categories</Link>
                <Link to="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-500 hover:text-indigo-600 text-sm py-0.5">Orders</Link>
                <Link to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-500 hover:text-indigo-600 text-sm py-0.5">Users</Link>
                <Link to="/admin/tickets" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-500 hover:text-indigo-600 text-sm py-0.5">Tickets</Link>
              </div>
            )}
            <hr className="border-gray-200" />
            {user ? (
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left text-red-500 font-medium py-1">Log out</button>
            ) : (
              <div className="flex gap-3 pt-1">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg">Log in</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
