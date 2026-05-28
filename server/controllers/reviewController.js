const Review = require('../models/Review');
const Book = require('../models/Book');

const getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    const avg = await Review.aggregate([
      { $match: { book: require('mongoose').Types.ObjectId(req.params.bookId) } },
      { $group: { _id: '$book', averageRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    res.json({ reviews, averageRating: avg[0]?.averageRating || 0, total: avg[0]?.count || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({ book: req.params.bookId, user: req.user._id });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const existing = await Review.findOne({ book: req.params.bookId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this book' });

    const review = await Review.create({
      user: req.user._id,
      book: req.params.bookId,
      rating,
      comment,
    });

    const populated = await Review.findById(review._id).populate('user', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();

    const populated = await Review.findById(review._id).populate('user', 'name');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBookReviews, getMyReview, createReview, updateReview, deleteReview };
