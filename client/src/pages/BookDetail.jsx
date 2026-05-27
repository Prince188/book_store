import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBook } from '../api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoriteContext } from '../context/FavoriteContext';

const PLACEHOLDER = 'https://via.placeholder.com/400x600?text=No+Cover';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const { isFavorite, toggle } = useContext(FavoriteContext);
  const [book, setBook] = useState(null);
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      try {
        const res = await getBook(id);
        setBook(res.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const showAlert = (message, isError = false) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAdd = async () => {
    if (!user) {
      showAlert('Please login to add items to cart', true);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    try {
      await addItem(book._id, qty);
      showAlert(`✓ Added ${qty} × "${book.title}" to cart!`);
    } catch (error) {
      showAlert('Failed to add to cart. Please try again.', true);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      showAlert('Please login to save favorites', true);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    await toggle(book._id);
    showAlert(isFavorite(book._id) ? '✓ Removed from favorites' : '✓ Added to favorites');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-6 bg-amber-100 rounded w-32 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-amber-100 rounded-2xl h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-amber-100 rounded w-3/4"></div>
                <div className="h-6 bg-amber-50 rounded w-1/2"></div>
                <div className="h-4 bg-amber-50 rounded w-1/3"></div>
                <div className="h-12 bg-amber-100 rounded w-1/4 mt-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-amber-50 rounded w-full"></div>
                  <div className="h-4 bg-amber-50 rounded w-5/6"></div>
                  <div className="h-4 bg-amber-50 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">Book Not Found</h2>
          <p className="text-stone-500 mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Link to="/books" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors">
            <span>←</span>
            Browse Other Books
          </Link>
        </div>
      </div>
    );
  }

  const isInStock = book.quantity > 0;
  const stockStatus = isInStock
    ? { text: `In Stock (${book.quantity} available)`, color: 'text-green-600', bg: 'bg-green-50' }
    : { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-slideInRight">
          <div className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${notificationMessage.includes('✓') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
            <span>{notificationMessage.includes('✓') ? '✓' : '⚠️'}</span>
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-stone-500">
          <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/books" className="hover:text-amber-600 transition-colors">Books</Link>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate">{book.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-12">
          {/* Book Cover Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-amber-300 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <img
                src={book.image || PLACEHOLDER}
                alt={book.title}
                className="w-full object-cover max-h-[500px] lg:max-h-[600px] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {isFavorite(book._id) && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                ❤️ Favorite
              </div>
            )}
          </div>

          {/* Book Details Section */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-stone-800 mb-2 leading-tight">
                {book.title}
              </h1>
              <p className="text-lg text-stone-600">by <span className="font-medium text-amber-700">{book.author}</span></p>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-2 mb-4">
              {book.category?.name && (
                <Link
                  to={`/books?category=${book.category._id}`}
                  className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-sm px-3 py-1 rounded-full hover:bg-amber-200 transition-colors"
                >
                  <span>📚</span>
                  {book.category.name}
                </Link>
              )}
              {book.publisher && (
                <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-sm px-3 py-1 rounded-full">
                  <span>🏢</span>
                  {book.publisher}
                </span>
              )}
              {book.publicationYear && (
                <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-sm px-3 py-1 rounded-full">
                  <span>📅</span>
                  {book.publicationYear}
                </span>
              )}
            </div>

            {/* Price and Stock */}
            <div className="flex items-baseline gap-4 mb-4">
              <p className="text-4xl lg:text-5xl font-bold text-amber-700">${book.price}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-stone-800 mb-2">About this book</h3>
              <p className="text-stone-600 leading-relaxed">
                {book.description || "No description available for this book."}
              </p>
            </div>

            {/* Quantity Selector */}
            {isInStock && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 rounded-lg border border-amber-200 flex items-center justify-center hover:bg-amber-50 transition-colors"
                  >
                    -
                  </button>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-20 text-center border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {Array.from({ length: Math.min(book.quantity, 10) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setQty(Math.min(book.quantity, qty + 1))}
                    className="w-10 h-10 rounded-lg border border-amber-200 flex items-center justify-center hover:bg-amber-50 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-stone-500 ml-2">max {Math.min(book.quantity, 10)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAdd}
                disabled={!isInStock}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${isInStock
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
              >
                <span>🛒</span>
                <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>

              {user && (
                <button
                  onClick={handleFavorite}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${isFavorite(book._id)
                      ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-amber-200 bg-white text-stone-700 hover:bg-amber-50'
                    }`}
                >
                  <span>{isFavorite(book._id) ? '❤️' : '🤍'}</span>
                  <span>{isFavorite(book._id) ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-amber-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-stone-500">ISBN:</span>
                  <p className="font-medium text-stone-700">{book.isbn || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-stone-500">Pages:</span>
                  <p className="font-medium text-stone-700">{book.pages || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-stone-500">Language:</span>
                  <p className="font-medium text-stone-700">{book.language || 'English'}</p>
                </div>
                <div>
                  <span className="text-stone-500">Format:</span>
                  <p className="font-medium text-stone-700">{book.format || 'Paperback'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books Section (Placeholder - can be implemented later) */}
        <div className="mt-16 pt-8 border-t border-amber-100">
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">You Might Also Like</h2>
          <div className="text-center py-8 bg-white rounded-2xl border border-amber-100">
            <p className="text-stone-500">More recommendations coming soon!</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookDetail;