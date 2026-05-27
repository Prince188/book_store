import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            📚 BookStore
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            <Link to="/books" className="hover:text-yellow-400 transition">Books</Link>
            <Link to="/cart" className="hover:text-yellow-400 transition">Cart</Link>
            <Link to="/favorites" className="hover:text-yellow-400 transition">Favorites</Link>
            {user && <Link to="/orders" className="hover:text-yellow-400 transition">Orders</Link>}
            {user?.role === 'admin' && (
              <div className="flex items-center space-x-4">
                <span className="text-yellow-400 text-sm font-medium">Admin:</span>
                <Link to="/admin" className="hover:text-yellow-300 transition">Dashboard</Link>
                <Link to="/admin/books" className="hover:text-yellow-300 transition">Books</Link>
                <Link to="/admin/categories" className="hover:text-yellow-300 transition">Categories</Link>
                <Link to="/admin/orders" className="hover:text-yellow-300 transition">Orders</Link>
              </div>
            )}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-300">{user.name}</span>
                <button onClick={logout} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
