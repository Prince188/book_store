import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavoriteContext } from '../context/FavoriteContext';
import BookCard from '../components/BookCard';
import Seo from '../components/Seo';

const Favorites = () => {
  const { favorites } = useContext(FavoriteContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="My Favorites" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Saved</p>
          <h1 className="text-3xl font-serif font-semibold text-gray-900 mt-2">My Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-4">No favorites yet</p>
            <Link to="/books" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Discover books &rarr;</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {favorites.map((book) => <BookCard key={book._id} book={book} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
