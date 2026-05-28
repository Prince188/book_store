import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { getBook, getBooks, createStockAlert } from '../api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoriteContext } from '../context/FavoriteContext';
import { ToastContext } from '../context/ToastContext';
import ReviewSection from '../components/ReviewSection';
import BookCard from '../components/BookCard';
import { BookDetailSkeleton } from '../components/Skeleton';

const PLACEHOLDER = 'https://via.placeholder.com/400x600?text=No+Cover';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const { isFavorite, toggle } = useContext(FavoriteContext);
  const { addToast } = useContext(ToastContext);
  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [alerted, setAlerted] = useState(false);

  useEffect(() => {
    getBook(id).then((r) => {
      setBook(r.data);
      const catId = (r.data.categories || [])[0]?._id;
      if (catId) {
        getBooks({ category: catId, limit: 5 }).then((res) => {
          setRelated(res.data.books.filter((b) => b._id !== r.data._id).slice(0, 4));
        });
      }
    });
  }, [id]);

  const handleAdd = async () => {
    if (!user) return addToast('Please sign in first', 'error');
    await addItem(book._id, qty);
    setAdded(true);
    addToast('Added to cart');
    setTimeout(() => setAdded(false), 2000);
  };

  const handleStockAlert = async () => {
    if (!user) return addToast('Please sign in first', 'error');
    try {
      await createStockAlert(book._id);
      setAlerted(true);
      addToast('We\'ll notify you when in stock');
    } catch (err) {
      addToast(err.response?.data?.message || 'Already subscribed', 'error');
    }
  };

  if (!book) return <BookDetailSkeleton />;

  return (<>
    <Seo title={book.title} description={`Buy ${book.title} by ${book.author} at Bookstore.`} />
    <div className="min-h-screen bg-[#FBFAF7]">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <Link to="/books" className="inline-flex items-center gap-1.5 text-sm text-[#6B655D] hover:text-[#9C8B73] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to books
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white border border-[#EBE6DC] overflow-hidden">
            <img src={book.image || PLACEHOLDER} alt={book.title} className="w-full aspect-[3/4] object-cover" />
          </div>

          <div className="space-y-6">
            {(book.categories || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(book.categories || []).map((c) => (
                  <span key={c?._id} className="inline-flex text-xs font-semibold text-[#9C8B73] bg-[#EBE6DC]/50 px-3 py-1">
                    {c?.name}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-serif text-[#2A2724] leading-tight">{book.title}</h1>
            <p className="text-lg text-[#6B655D]">by {book.author}</p>
            {book.publisher && <p className="text-sm text-[#A8A096]">{book.publisher}</p>}

            <div className="border-t border-[#EBE6DC] pt-6">
              <p className="text-4xl font-bold text-[#2A2724]">₹{book.price.toFixed(2)}</p>
              <p className={`text-sm mt-2 font-medium ${book.quantity > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {book.quantity > 0 ? `In stock — ${book.quantity} available` : 'Currently out of stock'}
              </p>
            </div>

            {book.description && <p className="text-[#6B655D] leading-relaxed">{book.description}</p>}

            {book.quantity > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#6B655D]">Quantity</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 border border-[#D9D3C7] text-sm hover:bg-[#EBE6DC]/30 transition-colors">&minus;</button>
                  <span className="w-10 text-center text-sm font-semibold text-[#2A2724]">{String(qty).padStart(2, '0')}</span>
                  <button onClick={() => setQty(Math.min(book.quantity, qty + 1))}
                    className="w-9 h-9 border border-[#D9D3C7] text-sm hover:bg-[#EBE6DC]/30 transition-colors">+</button>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={book.quantity === 0}
                className={`flex-1 px-8 py-3.5 font-semibold text-sm transition-all ${
                  added ? 'bg-emerald-600 text-white' : 'bg-[#2A2724] text-white hover:bg-[#6B655D]'
                } disabled:bg-[#EBE6DC] disabled:text-[#A8A096] disabled:cursor-not-allowed`}>
                {added ? '✓ Added to cart' : book.quantity === 0 ? 'Out of stock' : 'Add to cart'}
              </button>
              {user && (
                <button onClick={() => toggle(book._id)}
                  className={`px-6 py-3.5 border text-sm font-semibold transition-all ${
                    isFavorite(book._id)
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                      : 'border-[#D9D3C7] text-[#6B655D] hover:border-[#9C8B73]'
                  }`}>
                  {isFavorite(book._id) ? '❤️' : '♡'}
                </button>
              )}
            </div>

            {user && book.quantity === 0 && (
              <button onClick={handleStockAlert} disabled={alerted}
                className="w-full px-6 py-2.5 border border-[#D9D3C7] text-sm font-semibold text-[#6B655D] hover:bg-[#EBE6DC]/30 transition-all disabled:opacity-50">
                {alerted ? '✓ Notify me when back in stock' : '🔔 Notify me when back in stock'}
              </button>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-serif text-[#2A2724] mb-6">More in {(book.categories || [])[0]?.name || 'this category'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((b) => <BookCard key={b._id} book={b} />)}
            </div>
          </div>
        )}

        <ReviewSection bookId={id} />
      </div>
    </div>
    </>
  );
};

export default BookDetail;
