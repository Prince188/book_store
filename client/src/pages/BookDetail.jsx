import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBook } from '../api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoriteContext } from '../context/FavoriteContext';

const PLACEHOLDER = 'https://via.placeholder.com/400x600?text=No+Cover';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const { isFavorite, toggle } = useContext(FavoriteContext);
  const [book, setBook] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    getBook(id).then((res) => setBook(res.data));
  }, [id]);

  if (!book) return <div className="text-center py-20 text-xl">Loading...</div>;

  const handleAdd = async () => {
    if (!user) return alert('Please login first');
    await addItem(book._id, qty);
    alert('Added to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/books" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Books</Link>
      <div className="grid md:grid-cols-2 gap-10">
        <img src={book.image || PLACEHOLDER} alt={book.title} className="w-full rounded-xl shadow-lg object-cover max-h-96" />
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-500 text-lg mb-1">by {book.author}</p>
          {book.publisher && <p className="text-gray-400 text-sm mb-1">Publisher: {book.publisher}</p>}
          {book.category?.name && (
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded mt-1 mb-3">
              {book.category.name}
            </span>
          )}
          <p className="text-4xl font-bold text-green-700 my-4">${book.price}</p>
          <p className={`font-semibold ${book.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {book.quantity > 0 ? `In Stock (${book.quantity} available)` : 'Out of Stock'}
          </p>
          <p className="text-gray-600 my-4 leading-relaxed">{book.description}</p>

          {book.quantity > 0 && (
            <div className="flex items-center gap-4 mb-4">
              <label className="font-medium">Quantity:</label>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="border rounded px-3 py-2">
                {Array.from({ length: Math.min(book.quantity, 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleAdd}
              disabled={book.quantity === 0}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Add to Cart
            </button>
            {user && (
              <button
                onClick={() => toggle(book._id)}
                className="border px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                {isFavorite(book._id) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
