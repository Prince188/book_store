import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FavoriteContext } from '../context/FavoriteContext';
import { CartContext } from '../context/CartContext';

const PLACEHOLDER = 'https://via.placeholder.com/400x600?text=No+Cover';

const BookCard = ({ book }) => {
  const { user } = useContext(AuthContext);
  const { isFavorite, toggle } = useContext(FavoriteContext);
  const { addItem } = useContext(CartContext);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in first');
      return;
    }
    setIsTogglingFavorite(true);
    await toggle(book._id);
    setIsTogglingFavorite(false);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in first');
      return;
    }
    if (book.quantity === 0) return;

    setIsAddingToCart(true);
    await addItem(book._id);
    setIsAddingToCart(false);
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 1500);
  };

  const isOutOfStock = book.quantity === 0;
  const discountPercent = book.originalPrice ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;

  return (
    <Link to={`/books/${book._id}`} className="group block h-full">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative">

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            -{discountPercent}%
          </div>
        )}

        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={book.image || PLACEHOLDER}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={isTogglingFavorite}
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 z-10"
          >
            {isTogglingFavorite ? (
              <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isFavorite(book._id) ? (
              <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-500 hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="bg-white/95 text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-lg transform -rotate-6">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick View Hint */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Quick View
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[2.75rem] group-hover:text-indigo-600 transition-colors">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-sm text-gray-500 mt-1 min-h-[1.5rem] flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {book.author}
          </p>

          {/* Categories */}
          {(book.categories || []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 min-h-[1.75rem]">
              {(book.categories || []).slice(0, 2).map((cat, idx) => (
                <span key={idx} className="inline-block text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {cat?.name || cat}
                </span>
              ))}
              {(book.categories || []).length > 2 && (
                <span className="inline-block text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  +{(book.categories || []).length - 2}
                </span>
              )}
            </div>
          )}

          {/* Rating Placeholder (optional - add if you have rating data) */}
          {book.rating && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-3 h-3 ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">({book.reviewCount || 0})</span>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-xl text-gray-900">₹{book.price.toLocaleString('en-IN')}</span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <span className="text-xs text-gray-400 line-through">₹{book.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
              {!isOutOfStock && (
                <p className="text-xs text-green-600 mt-0.5">In Stock</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className={`
                relative overflow-hidden px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
                ${isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-md'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                group/btn
              `}
            >
              {isAddingToCart ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : showAddedFeedback ? (
                <span className="flex items-center gap-1 text-green-600 bg-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to Cart
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Added to Cart Feedback Indicator */}
        {showAddedFeedback && (
          <div className="absolute bottom-4 left-4 right-4 bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg animate-bounce">
            ✓ Added to cart
          </div>
        )}
      </div>
    </Link>
  );
};

export default BookCard;