'use strict';

const Ticket = require('../models/tickets');

class TicketsController {
    constructor() {
        this.getTickets = this.getTickets.bind(this);
        this.createTicket = this.createTicket.bind(this);
        this.getTicket = this.getTicket.bind(this);
        this.getComments = this.getComments.bind(this);
        this.createComment = this.createComment.bind(this);
        this.updateTicketStatus = this.updateTicketStatus.bind(this);
        this.updateTicketCategory = this.updateTicketCategory.bind(this);
    }

    /**
     * GET /api/tickets
     * Get all tickets
     */
    getTickets = function (req, res) {
        Ticket.selectAll()
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('An error occurred');
            });
    };

    /**
     * POST /api/tickets
     * Create a new ticket
     */
    createTicket = function (req, res) {
        //TODO: authenticate [user]
        //TODO: validate category, title, description
        const ticket = new Ticket(
            -1,
            1,
            null,
            Math.floor(Date.now() / 1000),
            Ticket.Status.OPEN,
            req.body.category,
            req.body.title,
            req.body.description
        );
        ticket
            .insert()
            .then(() => {
                res.json({ message: 'Ticket created' });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('An error occurred');
            });
    };

    /**
     * GET /api/tickets/:ticketId
     * Get a ticket by ID
     */
    getTicket = function (req, res) {
        //TODO: authenticate [user]
        //TODO: validate ticketId
        Ticket.selectById(req.params.ticketId)
            .then((result) => {
                if (result) {
                    res.json(result);
                } else {
                    res.status(404).send('Ticket not found');
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('An error occurred');
            });
    };

    /**
     * GET /api/tickets/:ticketId/comments
     * Get comments for a ticket
     */
    getComments = function (req, res) {
        //TODO: authenticate [user]
        //TODO: validate ticketId
        Ticket.selectById(req.params.ticketId)
            .then((result) => {
                if (result) {
                    return result.getComments();
                } else {
                    res.status(404).send('Ticket not found');
                }
            })
            .then((comments) => {
                res.json(comments);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('An error occurred');
            });
    };

    /**
     * POST /api/tickets/:ticketId/comments
     * Create a new comment for a ticket
     */
    createComment = function (req, res) {
        //TODO: authenticate [user]
        //TODO: validate ticketId, content
        Ticket.selectById(req.params.ticketId)
            .then((result) => {
                if (result) {
                    return result;
                } else {
                    res.status(404).send('Ticket not found');
                }
            })
            .then((ticket) => {
                return ticket.addComment(
                    1,
                    Math.floor(Date.now() / 1000),
                    req.body.content
                );
            })
            .then(() => {
                res.json({ message: 'Comment added to ticket' });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('An error occurred');
            });
    };

    /**
     * PUT /api/tickets/:ticketId/status
     * Update the status of a ticket
     */
    updateTicketStatus = function (req, res) {
        //TODO: authenticate [admin|owner]
        //TODO: validate ticketId, value
        Ticket.selectById(req.params.ticketId)
            .then((result) => {
                if (result) {
                    return result;
                } else {
                    res.status(404).send('Ticket not found');
                }
            })
            .then((ticket) => {
                ticket.status = req.body.value;
                return ticket.update();
            })
            .then((ticket) => {
                res.json({ message: 'Ticket status updated', ticket: ticket });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('An error occurred');
            });
    };

    /**
     * PUT /api/tickets/:ticketId/category
     * Update the category of a ticket
     */
    updateTicketCategory = function (req, res) {
        //TODO: authenticate [admin]
        //TODO: validate ticketId, value
        Ticket.selectById(req.params.ticketId)
            .then((result) => {
                if (result) {
                    return result;
                } else {
                    res.status(404).send('Ticket not found');
                }
            })
            .then((ticket) => {
                ticket.category = req.body.value;
                return ticket.update();
            })
            .then((ticket) => {
                res.json({
                    message: 'Ticket category updated',
                    ticket: ticket,
                });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('An error occurred');
            });
    };
}

module.exports = new TicketsController();
