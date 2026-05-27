import { createContext, useState, useContext } from 'react';
import { getFavorites, toggleFavorite } from '../api';
import { AuthContext } from './AuthContext';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchFavorites = async () => {
    if (!user) { setFavorites([]); return; }
    const res = await getFavorites();
    setFavorites(res.data);
  };

  const toggle = async (bookId) => {
    const res = await toggleFavorite(bookId);
    setFavorites(res.data);
    return res.data;
  };

  const isFavorite = (bookId) => favorites.includes(bookId);

  return (
    <FavoriteContext.Provider value={{ favorites, fetchFavorites, toggle, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};
