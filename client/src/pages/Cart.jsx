import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../api';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { cart, fetchCart, updateItem, removeItem } = useContext(CartContext);
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  const showAlert = (message, isError = false) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleCheckout = async () => {
    if (!user) {
      showAlert('Please login to checkout', true);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    setIsCheckingOut(true);
    try {
      await createOrder();
      await fetchCart();
      showAlert('✓ Order placed successfully! Thank you for shopping with us.');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Checkout failed. Please try again.', true);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateItem(bookId, newQuantity);
    } catch (error) {
      showAlert('Failed to update quantity', true);
    }
  };

  const handleRemoveItem = async (bookId, bookTitle) => {
    if (window.confirm(`Remove "${bookTitle}" from your cart?`)) {
      try {
        await removeItem(bookId);
        showAlert(`✓ Removed "${bookTitle}" from cart`);
      } catch (error) {
        showAlert('Failed to remove item', true);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-3">Cart is Locked</h2>
          <p className="text-stone-600 mb-6">
            Please login to view and manage your shopping cart.
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

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-8xl mb-6">🛒📖</div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-3">Your Cart is Empty</h2>
          <p className="text-stone-600 mb-6">
            Looks like you haven't added any books to your cart yet. 
            Start exploring our collection!
          </p>
          <Link 
            to="/books" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>📚</span>
            Browse Books
            <span>→</span>
          </Link>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const subtotal = total;
  const shipping = total > 50 ? 0 : 5.99;
  const tax = total * 0.1;
  const grandTotal = total + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white py-8">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-slideInRight">
          <div className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
            notificationMessage.includes('✓') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
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
            <span className="text-stone-800 font-medium">Shopping Cart</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 flex items-center gap-3">
            <span>🛒</span>
            Shopping Cart
            <span className="text-lg font-normal text-stone-500 bg-white px-3 py-1 rounded-full">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.book._id} className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex gap-4">
                  {/* Book Cover */}
                  <Link to={`/books/${item.book._id}`} className="flex-shrink-0">
                    <img 
                      src={item.book.image || 'https://via.placeholder.com/80x120?text=No+Cover'} 
                      alt={item.book.title} 
                      className="w-20 h-28 object-cover rounded-lg shadow-md transition-transform hover:scale-105 duration-300"
                    />
                  </Link>
                  
                  {/* Book Info */}
                  <div className="flex-1">
                    <Link to={`/books/${item.book._id}`} className="font-semibold text-stone-800 hover:text-amber-600 transition-colors line-clamp-2">
                      {item.book.title}
                    </Link>
                    <p className="text-stone-500 text-sm mt-1">by {item.book.author}</p>
                    
                    {/* Stock Status */}
                    {item.book.quantity > 0 && item.book.quantity < 5 && (
                      <p className="text-xs text-orange-600 mt-1">Only {item.book.quantity} left in stock</p>
                    )}
                    
                    {/* Mobile Price */}
                    <p className="text-amber-700 font-bold mt-2 lg:hidden">
                      ${item.book.price.toFixed(2)}
                    </p>
                    
                    {/* Quantity Controls - Mobile Optimized */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-amber-50 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.book._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-stone-700">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.book._id, item.quantity + 1)}
                          disabled={item.quantity >= item.book.quantity}
                          className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.book._id, item.book.title)}
                        className="text-stone-400 hover:text-red-500 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Desktop Price */}
                  <div className="hidden lg:block text-right">
                    <p className="text-amber-700 font-bold">${item.book.price.toFixed(2)}</p>
                    <p className="text-sm text-stone-400 mt-1">
                      Total: ${(item.book.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                {/* Mobile Total */}
                <div className="lg:hidden flex justify-between items-center mt-3 pt-3 border-t border-amber-50">
                  <span className="text-sm text-stone-500">Subtotal</span>
                  <span className="font-semibold text-stone-800">${(item.book.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 sticky top-20">
              <h2 className="text-xl font-serif font-bold text-stone-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                {shipping === 0 && (
                  <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg flex items-center gap-2">
                    <span>🎉</span>
                    <span>Free shipping on orders over $50!</span>
                  </div>
                )}
                
                <div className="border-t border-amber-100 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-stone-800">
                    <span>Total</span>
                    <span className="text-amber-700">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isCheckingOut
                    ? 'bg-stone-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    Proceed to Checkout
                  </>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
                <span>🔒</span>
                <span>Secure checkout</span>
                <span>•</span>
                <span>💳</span>
                <span>All major cards accepted</span>
              </div>
            </div>
            
            {/* Continue Shopping */}
            <Link 
              to="/books" 
              className="inline-flex items-center gap-2 mt-4 text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              <span>←</span>
              Continue Shopping
            </Link>
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

export default Cart;