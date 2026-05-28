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

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('items.book');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
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

const getSalesStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

    const dailySales = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'cancelled' } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const totalStats = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, totalOrders: { $sum: 1 } } },
    ]);

    const topBooks = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$items.book', sold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { sold: -1 } },
      { $limit: 10 },
      {
        $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' },
      },
      { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
      { $project: { title: '$book.title', sold: 1, revenue: 1 } },
    ]);

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      dailySales,
      totalRevenue: totalStats[0]?.totalRevenue || 0,
      totalOrders: totalStats[0]?.totalOrders || 0,
      topBooks,
      statusCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('items.book');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(24).font('Helvetica-Bold').text('Invoice', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#666').text(`Order #${order._id.slice(-8).toUpperCase()}`, { align: 'center' });
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#333').text('Bill To:');
    doc.fontSize(10).font('Helvetica').fillColor('#555');
    doc.text(order.user.name);
    doc.text(order.user.email);
    if (order.user.phone) doc.text(order.user.phone);
    if (order.user.address) doc.text(order.user.address);
    doc.moveDown(1.5);

    const tableTop = doc.y;
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#333');
    doc.text('Item', 50, tableTop, { width: 250 });
    doc.text('Qty', 300, tableTop, { width: 50, align: 'center' });
    doc.text('Price', 350, tableTop, { width: 80, align: 'right' });
    doc.text('Total', 450, tableTop, { width: 80, align: 'right' });

    doc.moveDown(0.5);
    doc.fontSize(9).font('Helvetica').fillColor('#555');

    let y = doc.y;
    for (const item of order.items) {
      doc.text(item.book?.title || 'Book', 50, y, { width: 250 });
      doc.text(item.quantity.toString(), 300, y, { width: 50, align: 'center' });
      doc.text(`$${item.price.toFixed(2)}`, 350, y, { width: 80, align: 'right' });
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 450, y, { width: 80, align: 'right' });
      y += 20;
    }

    doc.moveDown(1);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#333');
    doc.text(`Total: $${order.totalAmount.toFixed(2)}`, { align: 'right' });

    doc.fontSize(9).font('Helvetica').fillColor('#999');
    doc.text('Thank you for your purchase!', 50, doc.page.height - 50, { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrder, getAllOrders, updateOrderStatus, getSalesStats, downloadInvoice };
