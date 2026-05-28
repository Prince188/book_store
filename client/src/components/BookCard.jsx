import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FavoriteContext } from '../context/FavoriteContext';
import { CartContext } from '../context/CartContext';

const PLACEHOLDER = 'https://via.placeholder.com/400x600?text=No+Cover';

const BookCard = ({ book }) => {
  const { user } = useContext(AuthContext);
  const { isFavorite, toggle } = useContext(FavoriteContext);
  const { addItem } = useContext(CartContext);

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please sign in first');
    await toggle(book._id);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please sign in first');
    await addItem(book._id);
  };

  return (
    <Link to={`/books/${book._id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white">
          <img
            src={book.image || PLACEHOLDER}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover group-hover:scale-[1.05] transition-transform duration-500"
          />
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-xl shadow-sm hover:shadow-md hover:scale-110 transition-all"
          >
            {isFavorite(book._id) ? (
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            )}
          </button>
          {book.quantity === 0 && (
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white text-gray-900 text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">Out of stock</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.author}</p>
          {(book.categories || []).length > 0 && (
            <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
              {(book.categories || []).map((c) => c?.name).join(', ')}
            </span>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className="font-bold text-lg text-gray-900">${book.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              disabled={book.quantity === 0}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              + Add to cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
