import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBook } from '../api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import ReviewSection from '../components/ReviewSection';
import Seo from '../components/Seo';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const [book, setBook] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => { getBook(id).then((r) => setBook(r.data)); }, [id]);

  if (!book) return null;

  const handleAdd = () => {
    addItem(book._id, qty);
    addToast('Added to cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title={book.title} description={book.description?.slice(0, 160)} />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link to="/books" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-8 inline-block">
          &larr; Back to books
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Image */}
            <div className="md:col-span-2 bg-gray-50 p-8 flex items-center justify-center">
              {book.image ? (
                <img src={book.image} alt={book.title}
                  className="w-full max-w-[240px] h-auto object-contain drop-shadow-md" />
              ) : (
                <div className="w-full max-w-[240px] aspect-[3/4] bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-300 text-sm">No cover</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-3 p-8 md:p-10">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {Array.isArray(book.categories)
                  ? book.categories.map((c) => c.name || c).join(', ')
                  : 'General'}
              </p>
              <h1 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mt-2">{book.title}</h1>
              <p className="text-gray-500 mt-1 font-medium">{book.author}</p>

              <div className="flex items-baseline gap-3 mt-6">
                <span className="text-2xl font-bold text-indigo-600">&curren;{book.price?.toLocaleString('en-IN')}</span>
                {book.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">&curren;{book.originalPrice.toLocaleString('en-IN')}</span>
                )}
                {book.quantity != null && (
                  <span className={`ml-auto text-xs font-medium ${book.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {book.quantity > 0 ? `${book.quantity} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>

              {book.description && (
                <p className="text-gray-600 leading-relaxed mt-6 text-sm">{book.description}</p>
              )}

              {book.publisher && (
                <p className="text-xs text-gray-400 mt-4">Publisher: {book.publisher}</p>
              )}

              {book.quantity > 0 && (
                <div className="flex items-center gap-4 mt-8">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-3 py-2 text-gray-500 hover:bg-gray-50 text-sm leading-none">&minus;</button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[2rem] text-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(book.quantity, qty + 1))}
                      className="px-3 py-2 text-gray-500 hover:bg-gray-50 text-sm leading-none">+</button>
                  </div>
                  <button onClick={handleAdd}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all">
                    Add to cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <ReviewSection bookId={book._id} />
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
