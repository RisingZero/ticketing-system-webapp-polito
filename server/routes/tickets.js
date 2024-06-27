'use strict';

const express = require('express');
const router = express.Router();

const validationHandler = require('../middlewares/validationHandler');

const AuthService = require('../services/auth.service');
const requireAuth = require('../middlewares/requireAuth');

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
    requireAuth(),
    ticketsController.createTicket.validator,
    validationHandler,
    ticketsController.createTicket
);
router.get(
    '/:ticketId',
    requireAuth(),
    ticketsController.getTicket.validator,
    validationHandler,
    ticketsController.getTicket
);
router.get(
    '/:ticketId/comments',
    requireAuth(),
    ticketsController.getComments.validator,
    validationHandler,
    ticketsController.getComments
);
router.post(
    '/:ticketId/comments',
    requireAuth(),
    ticketsController.createComment.validator,
    validationHandler,
    ticketsController.createComment
);
router.put(
    '/:ticketId/status',
    requireAuth(),
    ticketsController.updateTicketStatus.validator,
    validationHandler,
    ticketsController.updateTicketStatus
);
router.put(
    '/:ticketId/category',
    requireAuth(AuthService.Roles.ADMIN),
    ticketsController.updateTicketCategory.validator,
    validationHandler,
    ticketsController.updateTicketCategory
);

module.exports = router;
