const express = require('express');
const router = express.Router();
const { getBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', protect, admin, upload.single('image'), createBook);
router.put('/:id', protect, admin, upload.single('image'), updateBook);
router.delete('/:id', protect, admin, deleteBook);

module.exports = router;
