'use strict';

const crypto = require('crypto');

class User {
    id = -1;
    username = null;
    password = null;
    isAdmin = false;
    #dbContext = null;

    constructor(id, username, password, is_admin, dbContext = null) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.isAdmin = is_admin;
        this.#dbContext = dbContext;
    }

    verifyPassword(checkPassword) {
        return new Promise((resolve, reject) => {
            crypto.scrypt(
                checkPassword,
                Buffer.from(this.password.split('$')[0], 'hex'),
                64,
                (err, hashedPassword) => {
                    if (err) {
                        reject(err);
                    }

                    if (
                        !crypto.timingSafeEqual(
                            Buffer.from(this.password.split('$')[1], 'hex'),
                            hashedPassword
                        )
                    ) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    static selectById(id, dbContext) {
        const query = `
            SELECT
                id,
                username,
                password,
                is_admin
            FROM users
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            if (!dbContext) {
                reject(new Error('Database context is required'));
            }

            dbContext.db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }

                if (!row) {
                    resolve(null);
                } else {
                    resolve(
                        new User(
                            row.id,
                            row.username,
                            row.password,
                            row.is_admin === 1,
                            dbContext
                        )
                    );
                }
            });
        });
    }

    static selectByUsername(username, dbContext) {
        const query = `
            SELECT
                id,
                username,
                password,
                is_admin
            FROM users
            WHERE username = ?
        `;

        return new Promise((resolve, reject) => {
            if (!dbContext) {
                reject(new Error('Database context is required'));
            }

            dbContext.db.get(query, [username], (err, row) => {
                if (err) {
                    reject(err);
                }

                if (!row) {
                    resolve(null);
                } else {
                    resolve(
                        new User(
                            row.id,
                            row.username,
                            row.password,
                            row.is_admin === 1,
                            dbContext
                        )
                    );
                }
            });
        });
    }
}

module.exports = User;
