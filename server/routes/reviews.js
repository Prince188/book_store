const express = require('express');
const router = express.Router();
const { getBookReviews, getMyReview, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/:bookId', getBookReviews);
router.get('/:bookId/mine', protect, getMyReview);
router.post('/:bookId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
