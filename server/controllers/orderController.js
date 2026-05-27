const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Book = require('../models/Book');

const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    for (const item of cart.items) {
      if (item.quantity > item.book.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${item.book.title}". Available: ${item.book.quantity}`,
        });
      }
    }

    const orderItems = cart.items.map((item) => ({
      book: item.book._id,
      quantity: item.quantity,
      price: item.book.price,
    }));

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.book.price * item.quantity, 0
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
    });

    for (const item of cart.items) {
      await Book.findByIdAndUpdate(item.book._id, {
        $inc: { quantity: -item.quantity },
      });
    }

    cart.items = [];
    await cart.save();

    const populated = await Order.findById(order._id).populate('items.book');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.book')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.book')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('items.book');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, getAllOrders, updateOrderStatus };
