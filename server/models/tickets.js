'use strict';

const db = require('../services/db.service');

class Ticket {
    id = -1;
    ownerId = -1;
    ownerUsername = null;
    createdAt = null;
    status = null;
    category = null;
    title = null;
    description = null;

    static Category = {
        INQUIRY: 'inquiry',
        MAINTENANCE: 'maintenance',
        NEW_FEATURE: 'new feature',
        ADMINISTRATIVE: 'administrative',
        PAYMENT: 'payment',
    };

    static Status = {
        OPEN: 'open',
        CLOSED: 'closed',
    };

    constructor(
        id,
        ownerId,
        ownerUsername,
        createdAt,
        status,
        category,
        title,
        description
    ) {
        this.id = id;
        this.ownerId = ownerId;
        this.ownerUsername = ownerUsername;
        this.createdAt = createdAt;
        this.status = status;
        this.category = category;
        this.title = title;
        this.description = description;
    }

    getComments() {
        const query = `
            SELECT
                c.id,
                c.posted_at,
                c.author_id,
                u.username AS author_username,
                c.content
            FROM comments c, users u, tickets t
            WHERE c.author_id = u.id AND c.ticket_id = t.id AND t.id = ?
            ORDER BY c.posted_at DESC`;

        return new Promise((resolve, reject) => {
            db.context.all(query, [this.id], (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(
                    result.map((row) => ({
                        id: row.id,
                        postedAt: row.posted_at,
                        authorId: row.author_id,
                        authorUsername: row.author_username,
                        content: row.content,
                    }))
                );
            });
        });
    }

    addComment(authorId, postedAt, content) {
        const query = `
            INSERT INTO comments (ticket_id, author_id, posted_at, content)
            VALUES (?, ?, ?, ?);`;

        return new Promise((resolve, reject) => {
            db.context.run(
                query,
                [this.id, authorId, postedAt, content],
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                }
            );
        });
    }

    insert() {
        const query = `
            INSERT INTO tickets (owner_id, created_at, title, status, category, description)
            VALUES (?, ?, ?, ?, ?, ?);`;

        return new Promise((resolve, reject) => {
            db.context.run(
                query,
                [
                    this.ownerId,
                    this.createdAt,
                    this.title,
                    this.status,
                    this.category,
                    this.description,
                ],
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                }
            );
        });
    }

    update() {
        const query = `
            UPDATE tickets
            SET
                status = ?,
                category = ?
            WHERE id = ?`;

        return new Promise((resolve, reject) => {
            db.context.run(
                query,
                [this.status, this.category, this.id],
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(this);
                }
            );
        });
    }

    static selectAll() {
        const query = `
            SELECT
                t.id,
                t.title,
                t.created_at,
                t.owner_id,
                u.username AS owner_username,
                t.status,
                t.category
            FROM tickets t, users u
            WHERE t.owner_id = u.id
            ORDER BY t.created_at DESC`;

        return new Promise((resolve, reject) => {
            db.context.all(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(
                    result.map(
                        (row) =>
                            new Ticket(
                                row.id,
                                row.owner_id,
                                row.owner_username,
                                row.created_at,
                                row.status,
                                row.category,
                                row.title,
                                null
                            )
                    )
                );
            });
        });
    }

    static selectById(id) {
        const query = `
            SELECT
                t.id,
                t.title,
                t.created_at,
                t.owner_id,
                u.username AS owner_username,
                t.status,
                t.category,
                t.description
            FROM tickets t, users u
            WHERE t.owner_id = u.id AND t.id = ?`;

        return new Promise((resolve, reject) => {
            db.context.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }

                if (!row) {
                    resolve(null);
                } else {
                    resolve(
                        new Ticket(
                            row.id,
                            row.owner_id,
                            row.owner_username,
                            row.created_at,
                            row.status,
                            row.category,
                            row.title,
                            row.description
                        )
                    );
                }
            });
        });
    }
}

module.exports = Ticket;
