const Book = require('../models/Book');
const cloudinary = require('../config/cloudinary');

const getBooks = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    let query = {};

    if (category) query.categories = { $in: [category] };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { title: 1 };
    if (sort === 'name_desc') sortOption = { title: -1 };

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('categories', 'name')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ books, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('categories', 'name');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, publisher, price, quantity, description } = req.body;
    let categories = req.body.categories;
    if (!Array.isArray(categories)) {
      categories = categories ? [categories] : [];
    }

    let image = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'book_store',
      });
      image = result.secure_url;
    }

    const book = await Book.create({
      title, author, publisher, price, quantity, categories, image, description,
    });

    const populated = await book.populate('categories', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const { title, author, publisher, price, quantity, description } = req.body;
    let categories = req.body.categories;

    book.title = title || book.title;
    book.author = author || book.author;
    book.publisher = publisher !== undefined ? publisher : book.publisher;
    book.price = price || book.price;
    book.quantity = quantity !== undefined ? quantity : book.quantity;
    if (req.body.categories !== undefined) {
      if (!Array.isArray(categories)) {
        categories = categories ? [categories] : [];
      }
      book.categories = categories;
    }
    book.description = description !== undefined ? description : book.description;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'book_store',
      });
      book.image = result.secure_url;
    }

    const updated = await book.save();
    const populated = await updated.populate('categories', 'name');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };
