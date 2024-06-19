'use strict';

const express = require('express');
const router = express.Router();

const ticketsController = require('../controllers/tickets');

router.get('/', ticketsController.getTickets);
router.post('/', ticketsController.createTicket);
router.get('/:ticketId', ticketsController.getTicket);
router.get('/:ticketId/comments', ticketsController.getComments);
router.post('/:ticketId/comments', ticketsController.createComment);
router.put('/:ticketId/status', ticketsController.updateTicketStatus);
router.put('/:ticketId/category', ticketsController.updateTicketCategory);

module.exports = router;
