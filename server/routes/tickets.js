const express = require('express');
const router = express.Router();
const { createTicket, getMyTickets, getTicket, getAllTickets, replyTicket, updateTicketStatus } = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/auth');

router.post('/', createTicket);
router.get('/', protect, getMyTickets);
router.get('/all', protect, admin, getAllTickets);
router.get('/:id', protect, getTicket);
router.post('/:id/reply', protect, replyTicket);
router.put('/:id/status', protect, admin, updateTicketStatus);

module.exports = router;
