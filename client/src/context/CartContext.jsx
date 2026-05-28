import { createContext, useState, useContext, useCallback } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    const res = await getCart();
    setCart(res.data);
  }, [user]);

  const addItem = async (bookId, quantity = 1) => {
    const res = await addToCart({ bookId, quantity });
    setCart(res.data);
  };

  const updateItem = async (bookId, quantity) => {
    const res = await updateCartItem(bookId, { quantity });
    setCart(res.data);
  };

  const removeItem = async (bookId) => {
    const res = await removeFromCart(bookId);
    setCart(res.data);
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addItem, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};
