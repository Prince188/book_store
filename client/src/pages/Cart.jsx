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

  useEffect(() => { if (user) fetchCart(); }, [user, fetchCart]);

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    setIsCheckingOut(true);
    try {
      await createOrder();
      await fetchCart();
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally { setIsCheckingOut(false); }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl border border-gray-100 p-12 shadow-sm max-w-sm mx-6">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view your cart</h2>
          <p className="text-sm text-gray-500 mb-6">Your items are waiting for you.</p>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">Sign in</Link>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl border border-gray-100 p-12 shadow-sm max-w-sm mx-6">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/books" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">Browse books</Link>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((s, i) => s + i.book.price * i.quantity, 0);
  const shipping = total > 50 ? 0 : 5.99;
  const grandTotal = total + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900">Cart</h1>
          <p className="text-gray-500 mt-1">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.book._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-5 items-center shadow-sm">
                <Link to={`/books/${item.book._id}`} className="flex-shrink-0 w-16 bg-gray-50 rounded-xl overflow-hidden">
                  <img src={item.book.image || 'https://via.placeholder.com/80x120'} alt={item.book.title} className="w-full aspect-[2/3] object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${item.book._id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">{item.book.title}</Link>
                  <p className="text-sm text-gray-500 mt-0.5">{item.book.author}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">₹{item.book.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateItem(item.book._id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}
                    className="w-8 h-8 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-30 transition-colors">&minus;</button>
                  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateItem(item.book._id, item.quantity + 1)} disabled={item.quantity >= item.book.quantity}
                    className="w-8 h-8 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-30 transition-colors">+</button>
                </div>
                <p className="font-bold text-gray-900 w-24 text-right">₹{(item.book.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item.book._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600 font-medium">Free</span> : `₹${shipping.toFixed(2)}`}</span></div>
                {shipping === 0 && (
                  <div className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-2 rounded-lg">Free shipping applied!</div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={isCheckingOut}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all">
                {isCheckingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : 'Checkout'}
              </button>
              <Link to="/books" className="block text-center text-sm text-gray-500 mt-4 hover:text-indigo-600 transition-colors">Continue shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
