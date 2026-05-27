import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FavoriteContext } from '../context/FavoriteContext';
import { CartContext } from '../context/CartContext';

const PLACEHOLDER = 'https://via.placeholder.com/200x300?text=No+Cover';

const BookCard = ({ book }) => {
  const { user } = useContext(AuthContext);
  const { isFavorite, toggle } = useContext(FavoriteContext);
  const { addItem } = useContext(CartContext);

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first');
    await toggle(book._id);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first');
    await addItem(book._id);
  };

  return (
    <Link to={`/books/${book._id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
        <div className="relative">
          <img
            src={book.image || PLACEHOLDER}
            alt={book.title}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition"
          >
            {isFavorite(book._id) ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{book.title}</h3>
          <p className="text-gray-500 text-sm">{book.author}</p>
          {book.category?.name && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mt-1">
              {book.category.name}
            </span>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xl font-bold text-green-700">${book.price}</span>
            <span className={`text-xs ${book.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {book.quantity > 0 ? `${book.quantity} in stock` : 'Out of stock'}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={book.quantity === 0}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
