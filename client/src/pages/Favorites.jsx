import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FavoriteContext } from '../context/FavoriteContext';
import { getBook } from '../api';
import Seo from '../components/Seo';

const PLACEHOLDER = 'https://via.placeholder.com/400x600?text=No+Cover';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const { favorites, fetchFavorites, toggle } = useContext(FavoriteContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchFavorites(); }, [user, fetchFavorites]);

  useEffect(() => {
    const load = async () => {
      if (favorites.length > 0) {
        setLoading(true);
        const results = await Promise.all(favorites.map((id) => getBook(id).then((r) => r.data).catch(() => null)));
        setBooks(results.filter(Boolean));
      } else { setBooks([]); }
      setLoading(false);
    };
    load();
  }, [favorites]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FBFAF7] flex items-center justify-center">
        <div className="text-center bg-white border border-[#EBE6DC] p-12 max-w-sm mx-6">
          <div className="text-5xl mb-4">❤️</div>
          <h2 className="text-xl font-serif text-[#2A2724] mb-2">Sign in to view favorites</h2>
          <p className="text-sm text-[#6B655D] mb-6">Your saved books are waiting.</p>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFAF7]">
      <Seo title="Saved Books" />
      <div className="bg-white border-b border-[#EBE6DC]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-serif text-[#2A2724]">Saved books</h1>
          <p className="text-[#6B655D] mt-1">{books.length} {books.length === 1 ? 'book' : 'books'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#D9D3C7] border-t-[#9C8B73] rounded-full animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center bg-white border border-[#EBE6DC] p-12 max-w-sm mx-auto">
            <p className="text-[#6B655D] mb-6">No saved books yet.</p>
            <Link to="/books" className="inline-block px-6 py-2.5 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all">Browse books</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book._id} className="group">
                <Link to={`/books/${book._id}`} className="block">
                  <div className="bg-white border border-[#EBE6DC] overflow-hidden mb-3">
                    <img src={book.image || PLACEHOLDER} alt={book.title} className="w-full aspect-[2/3] object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  </div>
                  <h3 className="font-semibold text-[#2A2724] line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-[#6B655D] mt-0.5">{book.author}</p>
                  <p className="font-bold text-[#2A2724] mt-1">₹{book.price.toFixed(2)}</p>
                </Link>
                <button onClick={() => toggle(book._id)}
                  className="mt-2 text-sm text-[#9C8B73] hover:text-[#8A8278] font-medium transition-colors">
                  &hearts; Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
