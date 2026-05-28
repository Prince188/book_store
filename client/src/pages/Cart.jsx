import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder, validateCoupon } from '../api';
import { ToastContext } from '../context/ToastContext';
import Seo from '../components/Seo';

const Cart = () => {
  const { cart, fetchCart, updateItem, removeItem } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [suggestedCoupons, setSuggestedCoupons] = useState([
    { code: 'WELCOME10', discount: '10% off', minOrder: 500 },
    { code: 'FREESHIP', discount: 'Free Shipping', minOrder: 1000 },
  ]);

  const subtotal = (cart?.items || []).reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);
  const savings = discount;
  const itemCount = (cart?.items || []).reduce((sum, item) => sum + item.quantity, 0);

  const handleCoupon = async () => {
    if (!couponCode.trim()) {
      addToast('Please enter a coupon code', 'warning');
      return;
    }
    setApplyingCoupon(true);
    try {
      const { data } = await validateCoupon({ code: couponCode, orderTotal: subtotal });
      setCoupon(data.coupon);
      setDiscount(data.discount);
      addToast('🎉 Coupon applied successfully!', 'success');
      setCouponCode('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid or expired coupon', 'error');
      setCoupon(null);
      setDiscount(0);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setDiscount(0);
    setCouponCode('');
    addToast('Coupon removed', 'info');
  };

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingId(bookId);
    await updateItem(bookId, newQuantity);
    setUpdatingId(null);
  };

  const handleRemoveItem = async (bookId) => {
    setRemovingId(bookId);
    await removeItem(bookId);
    setRemovingId(null);
    addToast('Item removed from cart', 'info');
  };

  const handleCheckout = async () => {
    if (!user) {
      addToast('Please sign in to continue', 'warning');
      navigate('/login');
      return;
    }
    setCheckingOut(true);
    try {
      await createOrder({ couponCode: coupon ? coupon.code : undefined });
      await fetchCart();
      addToast('✨ Order placed successfully! ✨', 'success');
      navigate('/orders');
    } catch (err) {
      addToast(err.response?.data?.message || 'Checkout failed. Please try again.', 'error');
    } finally {
      setCheckingOut(false);
    }
  };

  const applySuggestedCoupon = (code) => {
    setCouponCode(code);
    setTimeout(() => handleCoupon(), 100);
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50/30 flex items-center justify-center px-4">
        <Seo title="Cart" />
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6 animate-float">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any books to your cart yet.</p>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50/20">
      <Seo title={`Cart (${itemCount} items)`} />

      {/* Hero Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-0.5 bg-indigo-400 rounded-full"></div>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Your Collection</p>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} · Subtotal: ₹{subtotal.toLocaleString('en-IN')}
              </p>
            </div>
            <Link
              to="/books"
              className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2 group transition-colors"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cart.items.map((item, index) => (
              <div
                key={item._id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden animate-slideIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                  {/* Book Cover */}
                  <div className="flex-shrink-0 relative">
                    {item.book?.image ? (
                      <img
                        src={item.book.image}
                        alt={item.book.title}
                        className="w-28 h-36 sm:w-24 sm:h-32 object-cover rounded-lg shadow-md transform transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-28 h-36 sm:w-24 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-inner">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    {item.quantity > 1 && (
                      <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                        {item.quantity}
                      </div>
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/books/${item.book?._id}`}
                      className="font-serif font-semibold text-gray-900 hover:text-indigo-600 transition-colors text-lg line-clamp-1"
                    >
                      {item.book?.title || 'Unknown Title'}
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">{item.book?.author || 'Unknown Author'}</p>
                    
                    {/* Categories */}
                    {item.book?.categories && item.book.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.book.categories.slice(0, 2).map((cat, idx) => (
                          <span key={idx} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {typeof cat === 'object' ? cat.name : cat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">Quantity:</span>
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                          <button
                            onClick={() => handleUpdateQuantity(item.book?._id, item.quantity - 1)}
                            disabled={updatingId === item.book?._id}
                            className="px-3 py-1.5 text-gray-600 hover:bg-white hover:text-indigo-600 transition-colors disabled:opacity-40"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-gray-800">
                            {updatingId === item.book?._id ? (
                              <svg className="w-4 h-4 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.book?._id, item.quantity + 1)}
                            disabled={updatingId === item.book?._id}
                            className="px-3 py-1.5 text-gray-600 hover:bg-white hover:text-indigo-600 transition-colors disabled:opacity-40"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-lg font-bold text-indigo-600">
                            ₹{((item.book?.price || 0) * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400">₹{item.book?.price?.toLocaleString('en-IN')} each</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.book?._id)}
                          disabled={removingId === item.book?._id}
                          className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110 disabled:opacity-40"
                        >
                          {removingId === item.book?._id ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile summary hint */}
            <div className="lg:hidden bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                Total: <span className="font-bold text-indigo-600 text-lg">₹{total.toLocaleString('en-IN')}</span>
                {savings > 0 && <span className="text-green-600 text-xs ml-2">(Saved ₹{savings.toLocaleString('en-IN')})</span>}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Coupon Section */}
                {!coupon ? (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Have a coupon?</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <button
                        onClick={handleCoupon}
                        disabled={applyingCoupon}
                        className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 hover:shadow-md disabled:opacity-50"
                      >
                        {applyingCoupon ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                    
                    {/* Suggested Coupons */}
                    {subtotal >= 500 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Suggested for you:</p>
                        <div className="flex gap-2">
                          {suggestedCoupons.map((suggested) => (
                            subtotal >= suggested.minOrder && (
                              <button
                                key={suggested.code}
                                onClick={() => applySuggestedCoupon(suggested.code)}
                                className="text-xs bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 px-2 py-1 rounded-lg transition-colors"
                              >
                                {suggested.code} ({suggested.discount})
                              </button>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-xl p-4 border border-indigo-200 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                          </svg>
                          <span className="font-semibold text-indigo-800">{coupon.code}</span>
                        </div>
                        <p className="text-xs text-indigo-600 mt-1">
                          {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm animate-slideDown">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>

                  <div className="border-t border-gray-100 my-3"></div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-900 font-semibold text-base">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-indigo-600">₹{total.toLocaleString('en-IN')}</span>
                      {savings > 0 && (
                        <p className="text-xs text-green-600 mt-0.5 animate-pulse">
                          🎉 You saved ₹{savings.toLocaleString('en-IN')}!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Estimated Delivery
                  </span>
                  <span className="font-medium text-gray-700">3-5 business days</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut || total === 0}
                  className="w-full mt-4 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {checkingOut ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : user ? (
                    'Proceed to Checkout →'
                  ) : (
                    'Sign in to Checkout'
                  )}
                </button>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-4 pt-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure Checkout
                  </span>
                  <span>•</span>
                  <span>Free Shipping</span>
                  <span>•</span>
                  <span>30-Day Returns</span>
                </div>

                {/* Payment Methods */}
                <div className="flex justify-center gap-2 pt-2">
                  {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
                    <span key={method} className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Cart;