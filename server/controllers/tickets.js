'use strict';

const DbService = require('../services/db.service');
const Ticket = require('../models/tickets');

const { body, param } = require('express-validator');
const { getTimestamp } = require('../utils');

class TicketsController {
    constructor() {
        this.getTickets.validator = this.#getTicketsValidator;
        this.createTicket.validator = this.#createTicketValidator;
        this.getTicket.validator = this.#getTicketValidator;
        this.getComments.validator = this.#getCommentsValidator;
        this.createComment.validator = this.#createCommentValidator;
        this.updateTicketStatus.validator = this.#updateTicketStatusValidator;
        this.updateTicketCategory.validator =
            this.#updateTicketCategoryValidator;
    }

    /**
     * GET /api/tickets
     * Get all tickets
     */
    #getTicketsValidator = [];
    async getTickets(req, res) {
        try {
            const ticketList = await Ticket.selectAll(req.dbContext);
            res.json(ticketList);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred' });
        } finally {
            await req.dbContext.close();
        }
    }

    /**
     * POST /api/tickets
     * Create a new ticket
     */
    #createTicketValidator = [
        body('category')
            .isIn(Object.values(Ticket.Category))
            .withMessage(
                'Invalid category. Must be one of: ' +
                    Object.values(Ticket.Category)
            ),
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required')
            .trim()
            .isLength({ max: Ticket.TITLE_MAX_LENGTH })
            .withMessage(
                'Title must be less than ' +
                    Ticket.TITLE_MAX_LENGTH +
                    ' characters'
            )
            .escape(),
        body('description')
            .not()
            .isEmpty()
            .withMessage('Description is required')
            .trim()
            .isLength({ min: 1, max: Ticket.CONTENT_BLOCK_MAX_LENGTH })
            .withMessage(
                'Description must be less than ' +
                    Ticket.CONTENT_BLOCK_MAX_LENGTH +
                    ' characters'
            )
            .escape(),
    ];
    async createTicket(req, res) {
        const ticket = new Ticket(
            -1,
            req.user.id,
            null,
            getTimestamp(),
            Ticket.Status.OPEN,
            req.body.category,
            req.body.title,
            req.body.description,
            req.dbContext
        );

        try {
            await ticket.insert();
            res.status(201)
                .header('Location', `/api/tickets/${ticket.id}`)
                .json(ticket);
        } catch (err) {
            console.error(err);
            if (err.code === DbService.ERROR_CODES.BUSY) {
                res.status(503)
                    .header('Retry-After', 1500)
                    .json({ message: 'Busy, try again later' });
            } else {
                res.status(500).json({ message: 'An error occurred' });
            }
        } finally {
            await req.dbContext.close();
        }
    }

    /**
     * GET /api/tickets/:ticketId
     * Get a ticket by ID
     */
    #getTicketValidator = [
        param('ticketId')
            .isInt({ min: 1 })
            .withMessage('Invalid ticket ID, must be a positive integer'),
    ];
    async getTicket(req, res) {
        try {
            const ticket = await Ticket.selectById(
                req.params.ticketId,
                req.dbContext
            );
            if (!ticket) {
                res.status(404).json({ message: 'Ticket not found' });
                return;
            }
            res.json(ticket);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred' });
        } finally {
            await req.dbContext.close();
        }
    }

    /**
     * GET /api/tickets/:ticketId/comments
     * Get comments for a ticket
     */
    #getCommentsValidator = [
        param('ticketId')
            .isInt({ min: 1 })
            .withMessage('Invalid ticket ID, must be a positive integer'),
    ];
    async getComments(req, res) {
        try {
            const ticket = await Ticket.selectById(
                req.params.ticketId,
                req.dbContext
            );
            if (!ticket) {
                res.status(404).json({ message: 'Ticket not found' });
                return;
            }
            const comments = await ticket.getComments();
            res.json(comments);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred' });
        } finally {
            await req.dbContext.close();
        }
    }

    /**
     * POST /api/tickets/:ticketId/comments
     * Create a new comment for a ticket
     */
    #createCommentValidator = [
        param('ticketId')
            .isInt({ min: 1 })
            .withMessage('Invalid ticket ID, must be a positive integer'),
        body('content')
            .not()
            .isEmpty()
            .withMessage('Content is required')
            .trim()
            .isLength({ min: 1, max: Ticket.CONTENT_BLOCK_MAX_LENGTH })
            .withMessage(
                'Content must be less than ' +
                    Ticket.CONTENT_BLOCK_MAX_LENGTH +
                    ' characters'
            )
            .escape(),
    ];
    async createComment(req, res) {
        try {
            await req.dbContext.beginTransaction();
            const ticket = await Ticket.selectById(
                req.params.ticketId,
                req.dbContext
            );
            if (!ticket) {
                res.status(404).json({ message: 'Ticket not found' });
                return;
            }
            if (ticket.status === Ticket.Status.CLOSED) {
                res.status(409).json({
                    message: 'Cannot add comment to closed ticket',
                });
                return;
            }
            await ticket.addComment(
                req.user.id,
                getTimestamp(),
                req.body.content
            );
            await req.dbContext.commit();
            res.status(201)
                .header('Location', `/api/tickets/${ticket.id}/comments`)
                .json({ message: 'Comment added to ticket' });
        } catch (err) {
            console.error(err);
            if (err.code === DbService.ERROR_CODES.BUSY) {
                res.status(503)
                    .header('Retry-After', 1500)
                    .json({ message: 'Busy, try again later' });
            } else {
                res.status(500).json({ message: 'An error occurred' });
            }
        } finally {
            await req.dbContext.close();
        }
    }

    /**
     * PUT /api/tickets/:ticketId/status
     * Update the status of a ticket
     */
    #updateTicketStatusValidator = [
        param('ticketId')
            .isInt({ min: 1 })
            .withMessage('Invalid ticket ID, must be a positive integer'),
        body('value')
            .isIn(Object.values(Ticket.Status))
            .withMessage(
                'Invalid status. Must be one of: ' +
                    Object.values(Ticket.Status)
            ),
    ];
    async updateTicketStatus(req, res) {
        try {
            await req.dbContext.beginTransaction();
            const ticket = await Ticket.selectById(
                req.params.ticketId,
                req.dbContext
            );
            if (!ticket) {
                res.status(404).json({ message: 'Ticket not found' });
                return;
            }

            if (req.user.id !== ticket.userId && !req.user.isAdmin) {
                // Only the ticket owner or admins can update the status
                res.status(403).json({ message: 'Not authorized' });
                return;
            }

            if (req.body.value === Ticket.Status.OPEN) {
                if (!req.user.isAdmin) {
                    // Only admins can reopen closed tickets
                    res.status(403).json({ message: 'Not authorized' });
                    return;
                }
            }

            ticket.status = req.body.value;
            await ticket.update();
            await req.dbContext.commit();
            res.json({ message: 'Ticket status updated', ticket: ticket });
        } catch (err) {
            console.error(err);
            if (err.code === DbService.ERROR_CODES.BUSY) {
                res.status(503)
                    .header('Retry-After', 1500)
                    .json({ message: 'Busy, try again later' });
            } else {
                res.status(500).json({ message: 'An error occurred' });
            }
        } finally {
            await req.dbContext.close();
        }
    }

    /**
     * PUT /api/tickets/:ticketId/category
     * Update the category of a ticket
     */
    #updateTicketCategoryValidator = [
        param('ticketId')
            .isInt({ min: 1 })
            .withMessage('Invalid ticket ID, must be a positive integer'),
        body('value')
            .isIn(Object.values(Ticket.Category))
            .withMessage(
                'Invalid category. Must be one of: ' +
                    Object.values(Ticket.Category)
            ),
    ];
    async updateTicketCategory(req, res) {
        try {
            await req.dbContext.beginTransaction();
            const ticket = await Ticket.selectById(
                req.params.ticketId,
                req.dbContext
            );
            if (!ticket) {
                res.status(404).json({ message: 'Ticket not found' });
                return;
            }
            ticket.category = req.body.value;
            await ticket.update();
            await req.dbContext.commit();
            res.json({ message: 'Ticket category updated', ticket: ticket });
        } catch (err) {
            console.error(err);
            if (err.code === DbService.ERROR_CODES.BUSY) {
                res.status(503)
                    .header('Retry-After', 1500)
                    .json({ message: 'Busy, try again later' });
            } else {
                res.status(500).json({ message: 'An error occurred' });
            }
        } finally {
            await req.dbContext.close();
        }
    }
}

// Export singleton instance
module.exports = new TicketsController();
