'use strict';

const express = require('express');
const router = express.Router();

const validationHandler = require('../middlewares/validationHandler');

const ticketsController = require('../controllers/tickets');

// Database context middleware
router.use(require('../middlewares/dbContext'));

router.get(
    '/',
    ticketsController.getTickets.validator,
    validationHandler,
    ticketsController.getTickets
);
router.post(
    '/',
    ticketsController.createTicket.validator,
    validationHandler,
    ticketsController.createTicket
);
router.get(
    '/:ticketId',
    ticketsController.getTicket.validator,
    validationHandler,
    ticketsController.getTicket
);
router.get(
    '/:ticketId/comments',
    ticketsController.getComments.validator,
    validationHandler,
    ticketsController.getComments
);
router.post(
    '/:ticketId/comments',
    ticketsController.createComment.validator,
    validationHandler,
    ticketsController.createComment
);
router.put(
    '/:ticketId/status',
    ticketsController.updateTicketStatus.validator,
    validationHandler,
    ticketsController.updateTicketStatus
);
router.put(
    '/:ticketId/category',
    ticketsController.updateTicketCategory.validator,
    validationHandler,
    ticketsController.updateTicketCategory
);

module.exports = router;
