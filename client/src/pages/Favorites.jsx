import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FavoriteContext } from '../context/FavoriteContext';
import { getBook } from '../api';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const { favorites, fetchFavorites, toggle } = useContext(FavoriteContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user, fetchFavorites]);

  useEffect(() => {
    if (favorites.length > 0) {
      Promise.all(favorites.map((id) => getBook(id).then((r) => r.data)))
        .then(setBooks)
        .catch(() => setBooks([]));
    } else {
      setBooks([]);
    }
  }, [favorites]);

  if (!user) {
    return <div className="text-center py-20 text-xl">Please <Link to="/login" className="text-blue-600">login</Link> to view your favorites.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      {books.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl mb-4">No favorites yet</p>
          <Link to="/books" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Browse Books</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((book) => (
            <div key={book._id} className="flex items-center gap-4 border rounded-lg p-4 shadow-sm">
              <img src={book.image || 'https://via.placeholder.com/80x120'} alt={book.title} className="w-20 h-28 object-cover rounded" />
              <div className="flex-1">
                <Link to={`/books/${book._id}`} className="font-semibold hover:text-blue-600">{book.title}</Link>
                <p className="text-gray-500 text-sm">{book.author}</p>
                <p className="text-green-700 font-bold">${book.price}</p>
              </div>
              <button onClick={() => toggle(book._id)} className="text-red-500 hover:text-red-700">
                ❤️ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
