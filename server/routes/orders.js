const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, getAllOrders, updateOrderStatus, getSalesStats, downloadInvoice } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/all', protect, admin, getAllOrders);
router.get('/stats/sales', protect, admin, getSalesStats);
router.get('/:id', protect, getOrder);
router.get('/:id/invoice', protect, downloadInvoice);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
