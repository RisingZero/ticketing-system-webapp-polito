'use strict';

const DbService = require('../services/db.service');
const User = require('../models/users');

const { body } = require('express-validator');
const { getTimestamp } = require('../utils');

const crypto = require('crypto');

class UsersController {
    constructor() {}

    /**
     * POST /api/users/login
     * Login a user
     */
    async login(req, res) {
        console.log(req.user);
        res.json({
            id: req.user.id,
            username: req.user.username,
        });
    }

    /**
     * POST /api/users/passhash
     * Generate a password hash (DEVELOPMENT ONLY)
     */
    async passhash(req, res) {
        const password = req.query.password;
        const salt = crypto.randomBytes(24);
        crypto.scrypt(password, salt, 64, (err, hashedPassword) => {
            if (err) {
                res.status(500).json({ error: 'Error hashing password' });
            }

            res.json({
                password: `${salt.toString('hex')}$${hashedPassword.toString(
                    'hex'
                )}`,
            });
        });
    }
}

// Export singleton instance
module.exports = new UsersController();
