import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { getBookReviews, getMyReview, createReview, updateReview, deleteReview } from '../api';

const Star = ({ filled, onClick }) => (
  <button type="button" onClick={onClick}
    className={`text-xl transition-colors ${filled ? 'text-[#9C8B73]' : 'text-[#D9D3C7] hover:text-[#C9B79C]'}`}>
    ★
  </button>
);

const ReviewSection = ({ bookId, refreshKey }) => {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [myReview, setMyReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    getBookReviews(bookId).then((r) => {
      setReviews(r.data.reviews);
      setAvg(r.data.averageRating);
      setTotal(r.data.total);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [bookId, refreshKey]); // eslint-disable-line

  useEffect(() => {
    if (user) getMyReview(bookId).then((r) => setMyReview(r.data)).catch(() => {});
  }, [bookId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return addToast('Please select a rating', 'error');
    try {
      if (myReview) {
        await updateReview(myReview._id, { rating, comment });
        setMyReview({ ...myReview, rating, comment });
        addToast('Review updated');
      } else {
        const res = await createReview(bookId, { rating, comment });
        setMyReview(res.data);
        addToast('Review submitted');
      }
      setEditing(false);
      fetchReviews();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your review?')) return;
    try {
      await deleteReview(myReview._id);
      setMyReview(null);
      setEditing(false);
      setRating(0);
      setComment('');
      addToast('Review deleted');
      fetchReviews();
    } catch (err) {
      addToast('Failed to delete review', 'error');
    }
  };

  const startEdit = () => {
    setRating(myReview?.rating || 0);
    setComment(myReview?.comment || '');
    setEditing(true);
  };

  return (
    <div className="bg-white border border-[#EBE6DC] p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#2A2724]">
          Reviews {total > 0 && <span className="text-[#A8A096] font-normal">({total})</span>}
        </h2>
        {total > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex text-[#9C8B73] text-sm">{Array.from({ length: 5 }, (_, i) => <Star key={i} filled={i < Math.round(avg)} />)}</div>
            <span className="text-sm text-[#2A2724]">{avg.toFixed(1)}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-[#EBE6DC] rounded-xl animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-[#A8A096] text-sm text-center py-8">No reviews yet.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {reviews.map((r) => (
            <div key={r._id} className="bg-[#FBFAF7] p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-gradient-to-br from-[#9C8B73] to-[#C9B79C] rounded-full flex items-center justify-center text-white text-xs font-bold">{r.user?.name?.charAt(0) || 'U'}</div>
                <span className="text-sm text-[#2A2724]">{r.user?.name || 'Anonymous'}</span>
                <div className="flex text-[#9C8B73] text-sm ml-1">{Array.from({ length: 5 }, (_, i) => <Star key={i} filled={i < r.rating} />)}</div>
              </div>
              {r.comment && <p className="text-sm text-[#6B655D] mt-1 ml-9">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {user && (
        <div className="border-t border-[#EBE6DC] pt-6">
          {!editing && (
            <button onClick={startEdit}
              className="px-5 py-2.5 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all">
              {myReview ? 'Edit your review' : 'Write a review'}
            </button>
          )}
          {editing && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-[#6B655D] mb-2">Rating</p>
                <div className="flex gap-1">{Array.from({ length: 5 }, (_, i) => <Star key={i} filled={i < rating} onClick={() => setRating(i + 1)} />)}</div>
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review (optional)" rows="3"
                className="w-full px-4 py-2.5 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" />
              <div className="flex gap-3">
                <button type="submit" className="px-5 py-2.5 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all">
                  {myReview ? 'Update' : 'Submit'}
                </button>
                <button type="button" onClick={() => setEditing(false)}
                  className="px-5 py-2.5 border border-[#D9D3C7] text-[#6B655D] text-sm hover:bg-[#EBE6DC]/30 transition-all">Cancel</button>
                {myReview && (
                  <button type="button" onClick={handleDelete}
                    className="px-5 py-2.5 text-red-500 text-sm hover:bg-red-50 transition-all">Delete</button>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
