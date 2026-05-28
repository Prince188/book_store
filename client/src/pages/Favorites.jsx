import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FavoriteContext } from '../context/FavoriteContext';
import { getBook } from '../api';

const PLACEHOLDER = 'https://via.placeholder.com/400x600?text=No+Cover';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const { favorites, fetchFavorites, toggle } = useContext(FavoriteContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchFavorites(); }, [user, fetchFavorites]);

  useEffect(() => {
    const load = async () => {
      if (favorites.length > 0) {
        setLoading(true);
        const results = await Promise.all(favorites.map((id) => getBook(id).then((r) => r.data).catch(() => null)));
        setBooks(results.filter(Boolean));
      } else { setBooks([]); }
      setLoading(false);
    };
    load();
  }, [favorites]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl border border-gray-100 p-12 shadow-sm max-w-sm mx-6">
          <div className="text-5xl mb-4">❤️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view favorites</h2>
          <p className="text-sm text-gray-500 mb-6">Your saved books are waiting.</p>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900">Saved books</h1>
          <p className="text-gray-500 mt-1">{books.length} {books.length === 1 ? 'book' : 'books'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center bg-white rounded-3xl border border-gray-100 p-12 shadow-sm max-w-sm mx-auto">
            <p className="text-gray-500 mb-6">No saved books yet.</p>
            <Link to="/books" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">Browse books</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book._id} className="group">
                <Link to={`/books/${book._id}`} className="block">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3 shadow-sm">
                    <img src={book.image || PLACEHOLDER} alt={book.title} className="w-full aspect-[2/3] object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
                  <p className="font-bold text-gray-900 mt-1">₹{book.price.toFixed(2)}</p>
                </Link>
                <button onClick={() => toggle(book._id)}
                  className="mt-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
                  &hearts; Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
