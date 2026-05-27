import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FavoriteContext } from '../context/FavoriteContext';
import { getBook } from '../api';

// Use a reliable placeholder service
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140"%3E%3Crect width="100" height="140" fill="%23f3f4f6"/%3E%3Ctext x="50" y="70" text-anchor="middle" fill="%239ca3af" font-size="12"%3ENo Cover%3C/text%3E%3C/svg%3E';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const { favorites, fetchFavorites, toggle } = useContext(FavoriteContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (favorites.length > 0) {
        setIsLoading(true);
        try {
          const bookPromises = favorites.map((id) => getBook(id).then((r) => r.data));
          const fetchedBooks = await Promise.all(bookPromises);
          setBooks(fetchedBooks);
        } catch (error) {
          console.error('Error fetching favorite books:', error);
          setBooks([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setBooks([]);
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [favorites]);

  const showAlert = (message, isError = false) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleRemove = async (bookId, bookTitle) => {
    setRemovingId(bookId);
    try {
      await toggle(bookId);
      showAlert(`✓ Removed "${bookTitle}" from favorites`);
    } catch (error) {
      showAlert('Failed to remove from favorites', true);
    } finally {
      setRemovingId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-3">Favorites are Locked</h2>
          <p className="text-stone-600 mb-6">
            Please login to view and manage your favorite books.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/books"
              className="px-6 py-3 border border-amber-200 text-stone-700 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white py-8">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-4 text-stone-500">
            <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-800 font-medium">My Favorites</span>
          </nav>

          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 flex items-center gap-3">
                <span>❤️</span>
                My Favorites
                <span className="text-lg font-normal text-stone-500 bg-white px-3 py-1 rounded-full">
                  {books.length} {books.length === 1 ? 'book' : 'books'}
                </span>
              </h1>
              <p className="text-stone-500 mt-2">Books you've saved for later</p>
            </div>
            {books.length > 0 && (
              <Link
                to="/books"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                <span>+</span>
                Add More Books
              </Link>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl border border-amber-100 p-4">
                  <div className="flex gap-4">
                    <div className="bg-amber-100 rounded-lg w-24 h-32"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-amber-100 rounded w-3/4"></div>
                      <div className="h-3 bg-amber-50 rounded w-1/2"></div>
                      <div className="h-5 bg-amber-100 rounded w-1/3 mt-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-12 text-center">
            <div className="text-8xl mb-6">❤️📖</div>
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-3">No Favorites Yet</h2>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">
              Start adding books to your favorites by clicking the heart icon on any book.
              Your saved books will appear here.
            </p>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>📚</span>
              Explore Books
              <span>→</span>
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <div
                key={book._id}
                className="group bg-white rounded-2xl border border-amber-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Book Cover */}
                    <Link to={`/books/${book._id}`} className="flex-shrink-0">
                      <img
                        src={book.image || PLACEHOLDER_IMAGE}
                        alt={book.title}
                        className="w-24 h-32 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </Link>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/books/${book._id}`}>
                        <h3 className="font-semibold text-stone-800 hover:text-amber-600 transition-colors line-clamp-2">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-stone-500 text-sm mt-1">by {book.author}</p>

                      {/* Category Badge */}
                      {book.category?.name && (
                        <span className="inline-block bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full mt-2">
                          {book.category.name}
                        </span>
                      )}

                      {/* Price */}
                      <p className="text-amber-700 font-bold text-lg mt-2">
                        ${book.price}
                      </p>

                      {/* Stock Status */}
                      {book.quantity > 0 ? (
                        book.quantity < 5 ? (
                          <p className="text-xs text-orange-600 mt-1">Only {book.quantity} left</p>
                        ) : (
                          <p className="text-xs text-green-600 mt-1">In Stock</p>
                        )
                      ) : (
                        <p className="text-xs text-red-600 mt-1">Out of Stock</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-amber-50">
                    <Link
                      to={`/books/${book._id}`}
                      className="flex-1 text-center px-3 py-2 text-sm font-medium text-stone-700 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemove(book._id, book.title)}
                      disabled={removingId === book._id}
                      className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {removingId === book._id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : (
                        '❤️ Remove'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions Section */}
        {books.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-serif font-bold text-stone-800 text-lg">Love these books?</h3>
                <p className="text-stone-600 text-sm">Add them to your cart and complete your purchase</p>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/cart"
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                >
                  Go to Cart
                </Link>
                <Link
                  to="/books"
                  className="px-6 py-2 border border-amber-300 text-stone-700 rounded-lg font-medium hover:bg-white transition-colors"
                >
                  Discover More
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        .animate-spin {
          animation: spin 0.6s linear infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Favorites;