import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../api';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { cart, fetchCart, updateItem, removeItem } = useContext(CartContext);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  const handleCheckout = async () => {
    try {
      await createOrder();
      await fetchCart();
      alert('Order placed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    }
  };

  if (!user) {
    return <div className="text-center py-20 text-xl">Please <Link to="/login" className="text-blue-600">login</Link> to view your cart.</div>;
  }

  if (!cart?.items?.length) {
    return (
      <div className="text-center py-20">
        <p className="text-xl mb-4">Your cart is empty</p>
        <Link to="/books" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Browse Books</Link>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cart.items.map((item) => (
        <div key={item.book._id} className="flex items-center gap-4 border-b py-4">
          <img src={item.book.image || 'https://via.placeholder.com/80x120'} alt={item.book.title} className="w-20 h-28 object-cover rounded" />
          <div className="flex-1">
            <Link to={`/books/${item.book._id}`} className="font-semibold hover:text-blue-600">{item.book.title}</Link>
            <p className="text-gray-500 text-sm">{item.book.author}</p>
            <p className="text-green-700 font-bold">${item.book.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateItem(item.book._id, Math.max(0, item.quantity - 1))}
              className="bg-gray-200 px-2 py-1 rounded"
            >-</button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => updateItem(item.book._id, item.quantity + 1)}
              className="bg-gray-200 px-2 py-1 rounded"
            >+</button>
          </div>
          <p className="font-bold w-24 text-right">${(item.book.price * item.quantity).toFixed(2)}</p>
          <button onClick={() => removeItem(item.book._id)} className="text-red-500 hover:text-red-700 ml-2">✕</button>
        </div>
      ))}
      <div className="text-right mt-6">
        <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
        <button onClick={handleCheckout} className="mt-4 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
