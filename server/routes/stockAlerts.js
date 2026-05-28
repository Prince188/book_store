const express = require('express');
const router = express.Router();
const { createAlert, getMyAlerts, deleteAlert } = require('../controllers/stockAlertController');
const { protect } = require('../middleware/auth');

router.post('/:bookId', protect, createAlert);
router.get('/', protect, getMyAlerts);
router.delete('/:bookId', protect, deleteAlert);

module.exports = router;
