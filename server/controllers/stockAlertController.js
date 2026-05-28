const StockAlert = require('../models/StockAlert');
const Book = require('../models/Book');

const createAlert = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.quantity > 0) return res.status(400).json({ message: 'Book is in stock' });

    const existing = await StockAlert.findOne({ book: req.params.bookId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already subscribed' });

    const alert = await StockAlert.create({ user: req.user._id, book: req.params.bookId });
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAlerts = async (req, res) => {
  try {
    const alerts = await StockAlert.find({ user: req.user._id }).populate('book');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAlert = async (req, res) => {
  try {
    await StockAlert.findOneAndDelete({ book: req.params.bookId, user: req.user._id });
    res.json({ message: 'Alert removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAlert, getMyAlerts, deleteAlert };
