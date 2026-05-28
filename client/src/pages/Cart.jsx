import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { createOrder, validateCoupon } from '../api';
import Seo from '../components/Seo';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { cart, fetchCart, updateItem, removeItem } = useContext(CartContext);
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => { if (user) fetchCart(); }, [user, fetchCart]);

  const subtotal = cart?.items?.reduce((s, i) => s + i.book.price * i.quantity, 0) || 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const grandTotal = Math.round((subtotal - discount + shipping) * 100) / 100;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await validateCoupon({ code: couponCode, orderTotal: subtotal });
      setAppliedCoupon(res.data.coupon);
      setDiscount(res.data.discount);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponError('');
  };

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    setIsCheckingOut(true);
    try {
      await createOrder({ couponCode: appliedCoupon?.code || undefined });
      await fetchCart();
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally { setIsCheckingOut(false); }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FBFAF7] flex items-center justify-center">
        <div className="text-center bg-white border border-[#EBE6DC] p-12 max-w-sm mx-6">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-serif text-[#2A2724] mb-2">Sign in to view your cart</h2>
          <p className="text-sm text-[#6B655D] mb-6">Your items are waiting for you.</p>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all">Sign in</Link>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-[#FBFAF7] flex items-center justify-center">
        <div className="text-center bg-white border border-[#EBE6DC] p-12 max-w-sm mx-6">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-xl font-serif text-[#2A2724] mb-2">Your cart is empty</h2>
          <p className="text-sm text-[#6B655D] mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/books" className="inline-block px-6 py-2.5 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all">Browse books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFAF7]">
      <Seo title="Shopping Cart" />
      <div className="bg-white border-b border-[#EBE6DC]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-serif text-[#2A2724]">Cart</h1>
          <p className="text-[#6B655D] mt-1">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.book._id} className="bg-white border border-[#EBE6DC] p-5 flex gap-5 items-center">
                <Link to={`/books/${item.book._id}`} className="flex-shrink-0 w-16 bg-[#FBFAF7] overflow-hidden">
                  <img src={item.book.image || 'https://via.placeholder.com/80x120'} alt={item.book.title} className="w-full aspect-[2/3] object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${item.book._id}`} className="font-semibold text-[#2A2724] hover:text-[#9C8B73] transition-colors line-clamp-1">{item.book.title}</Link>
                  <p className="text-sm text-[#6B655D] mt-0.5">{item.book.author}</p>
                  <p className="text-sm font-semibold text-[#2A2724] mt-1">₹{item.book.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateItem(item.book._id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}
                    className="w-8 h-8 border border-[#D9D3C7] text-sm hover:bg-[#EBE6DC]/30 disabled:opacity-30 transition-colors">&minus;</button>
                  <span className="text-sm font-semibold w-6 text-center text-[#2A2724]">{item.quantity}</span>
                  <button onClick={() => updateItem(item.book._id, item.quantity + 1)} disabled={item.quantity >= item.book.quantity}
                    className="w-8 h-8 border border-[#D9D3C7] text-sm hover:bg-[#EBE6DC]/30 disabled:opacity-30 transition-colors">+</button>
                </div>
                <p className="font-bold text-[#2A2724] w-24 text-right">₹{(item.book.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item.book._id)} className="text-[#A8A096] hover:text-red-500 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-[#EBE6DC] p-6 sticky top-24">
              <h2 className="text-lg font-serif text-[#2A2724] mb-4">Order summary</h2>

              {/* Coupon */}
              <div className="mb-4">
                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-emerald-700">{appliedCoupon.code}</span>
                        <p className="text-xs text-emerald-600 mt-0.5">Discount: -₹{discount.toFixed(2)}</p>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-emerald-500 hover:text-emerald-700 text-sm font-medium">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())} placeholder="Coupon code"
                        className="flex-1 px-3 py-2 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73] uppercase" />
                      <button onClick={handleApplyCoupon} disabled={!couponCode.trim() || couponLoading}
                        className="px-3 py-2 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">{couponLoading ? '...' : 'Apply'}</button>
                    </div>
                    {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#6B655D]"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between text-[#6B655D]"><span>Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600 font-medium">Free</span> : `₹${shipping.toFixed(2)}`}</span></div>
                {shipping === 0 && (
                  <div className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-2">Free shipping applied!</div>
                )}
                <div className="border-t border-[#EBE6DC] pt-3 flex justify-between font-bold text-[#2A2724] text-lg">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} disabled={isCheckingOut}
                className="w-full mt-6 bg-[#2A2724] text-white py-3 font-semibold text-sm hover:bg-[#6B655D] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {isCheckingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : 'Checkout'}
              </button>
              <Link to="/books" className="block text-center text-sm text-[#6B655D] mt-4 hover:text-[#9C8B73] transition-colors">Continue shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
