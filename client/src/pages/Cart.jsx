import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder, validateCoupon } from '../api';
import { ToastContext } from '../context/ToastContext';
import Seo from '../components/Seo';

const Cart = () => {
  const { cart, updateQty, removeFromCart, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { data } = await validateCoupon({ code: couponCode, orderTotal: subtotal });
      setCoupon(data.coupon);
      setDiscount(data.discount);
      addToast('Coupon applied');
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid coupon', 'error');
      setCoupon(null);
      setDiscount(0);
    }
  };

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return; }
    setCheckingOut(true);
    try {
      await createOrder({ couponCode: coupon ? couponCode : undefined });
      await fetchCart();
      addToast('Order placed!');
      navigate('/orders');
    } catch (err) {
      addToast(err.response?.data?.message || 'Checkout failed', 'error');
    } finally {
      setCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Seo title="Cart" />
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
          <Link to="/books" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Browse books &rarr;</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="Cart" />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-serif font-semibold text-gray-900 mb-10">Shopping cart</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 shadow-sm">
                {item.book?.image ? (
                  <img src={item.book.image} alt={item.book.title} className="w-20 h-28 object-cover rounded" />
                ) : (
                  <div className="w-20 h-28 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-300 text-xs">No cover</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${item.book?._id}`} className="font-serif font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                    {item.book?.title || 'Unknown'}
                  </Link>
                  <p className="text-sm text-gray-500">{item.book?.author}</p>
                  <p className="text-sm font-semibold text-indigo-600 mt-1">&curren;{item.book?.price?.toLocaleString('en-IN')}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                      <button onClick={() => updateQty(item.book?._id, Math.max(1, item.quantity - 1))}
                        className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 text-sm">&minus;</button>
                      <span className="px-3 py-1.5 text-sm font-medium text-gray-900">{item.quantity}</span>
                      <button onClick={() => updateQty(item.book?._id, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 text-sm">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.book?._id)}
                      className="text-xs text-red-500 hover:text-red-600 font-medium">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24 self-start">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Summary</h2>

            {!coupon && (
              <div className="mb-4 flex gap-2">
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button onClick={handleCoupon}
                  className="px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors">
                  Apply
                </button>
              </div>
            )}
            {coupon && (
              <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm">
                <p className="font-semibold text-indigo-700">{couponCode}</p>
                <p className="text-indigo-600 text-xs mt-0.5">{coupon.type === 'percentage' ? `${coupon.value}% off` : `\u20B9${coupon.value} off`}</p>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>&curren;{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-&curren;{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <hr className="border-gray-200 my-2" />
              <div className="flex justify-between text-gray-900 font-semibold text-base">
                <span>Total</span>
                <span>&curren;{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button onClick={handleCheckout} disabled={checkingOut}
              className="w-full mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50">
              {checkingOut ? 'Processing...' : user ? 'Checkout' : 'Sign in to checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
