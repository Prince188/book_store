import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBook } from '../api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import ReviewSection from '../components/ReviewSection';
import Seo from '../components/Seo';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const [book, setBook] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const r = await getBook(id);
        setBook(r.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      addToast('Please sign in to add items to cart', 'warning');
      return;
    }
    setAddingToCart(true);
    await addItem(book._id, qty);
    setAddingToCart(false);
    addToast(`✓ Added ${qty} × "${book.title}" to cart`, 'success');
  };

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1 && newQty <= (book?.quantity || 10)) {
      setQty(newQty);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-2 bg-gray-100 p-8">
                  <div className="w-full max-w-[240px] mx-auto aspect-[3/4] bg-gray-200 rounded-xl"></div>
                </div>
                <div className="md:col-span-3 p-8 md:p-10 space-y-4">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                  <div className="h-10 w-40 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
                  </div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Book not found</h2>
          <p className="text-gray-500 mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Link to="/books" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = book.quantity === 0;
  const discountPercent = book.originalPrice ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;
  const description = book.description || '';
  const shouldTruncate = description.length > 300 && !showFullDescription;
  const truncatedDescription = shouldTruncate ? description.slice(0, 300) + '...' : description;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50/20">
      <Seo title={book.title} description={book.description?.slice(0, 160)} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Back Button */}
        <Link 
          to="/books" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to books
        </Link>

        {/* Main Book Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-5">
            
            {/* Image Section */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 flex flex-col items-center justify-center">
              <div className="relative group">
                {book.image ? (
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full max-w-[280px] h-auto object-contain rounded-xl shadow-lg transform transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full max-w-[280px] aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                    <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-gray-400 text-sm">No cover image</span>
                  </div>
                )}
                
                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform rotate-6">
                    -{discountPercent}%
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10">
              {/* Categories */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(book.categories) && book.categories.length > 0 ? (
                    book.categories.map((c, idx) => (
                      <span key={idx} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                        {typeof c === 'object' ? c.name : c}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Uncategorized</span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 leading-tight">
                {book.title}
              </h1>
              
              {/* Author */}
              <div className="flex items-center gap-2 mt-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-gray-600 font-medium">{book.author}</p>
              </div>

              {/* Rating (optional - add if you have rating data) */}
              {book.rating && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{book.rating} ({book.reviewCount || 0} reviews)</span>
                </div>
              )}

              {/* Price Section */}
              <div className="mt-6 flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-indigo-600">₹{book.price?.toLocaleString('en-IN')}</span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <>
                    <span className="text-base text-gray-400 line-through">₹{book.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-green-600 font-medium">Save ₹{(book.originalPrice - book.price).toLocaleString('en-IN')}</span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-3">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 text-sm font-medium rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    In Stock • {book.quantity} {book.quantity === 1 ? 'copy' : 'copies'} available
                  </span>
                )}
              </div>

              {/* Description */}
              {description && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">About this book</h3>
                  <div className="text-gray-600 leading-relaxed text-sm space-y-2">
                    <p>{truncatedDescription}</p>
                    {description.length > 300 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium inline-flex items-center gap-1"
                      >
                        {showFullDescription ? 'Show less' : 'Read more'}
                        <svg className={`w-3.5 h-3.5 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Book Details Grid */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {book.publisher && (
                    <div>
                      <span className="text-xs text-gray-400 block">Publisher</span>
                      <span className="text-gray-700 font-medium">{book.publisher}</span>
                    </div>
                  )}
                  {book.publishedYear && (
                    <div>
                      <span className="text-xs text-gray-400 block">Published</span>
                      <span className="text-gray-700 font-medium">{book.publishedYear}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div>
                      <span className="text-xs text-gray-400 block">ISBN</span>
                      <span className="text-gray-700 font-medium">{book.isbn}</span>
                    </div>
                  )}
                  {book.pages && (
                    <div>
                      <span className="text-xs text-gray-400 block">Pages</span>
                      <span className="text-gray-700 font-medium">{book.pages}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart Section */}
              {!isOutOfStock && (
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button 
                        onClick={() => handleQuantityChange(qty - 1)}
                        disabled={qty <= 1}
                        className="px-4 py-2.5 text-gray-600 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-12 text-center font-medium text-gray-800">{qty}</span>
                      <button 
                        onClick={() => handleQuantityChange(qty + 1)}
                        disabled={qty >= book.quantity}
                        className="px-4 py-2.5 text-gray-600 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {addingToCart ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </button>

                    {/* Wishlist Button */}
                    <button className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:text-red-500 hover:border-red-200 transition-all duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Out of Stock CTA */}
              {isOutOfStock && (
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-sm mb-3">This book is currently out of stock</p>
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      Notify me when available
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <ReviewSection bookId={book._id} />
        </div>
      </div>
    </div>
  );
};

export default BookDetail;