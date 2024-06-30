'use strict';

const environment = require('../environment');

const DbService = require('../services/db.service');
const User = require('../models/users');

const { body } = require('express-validator');
const { getTimestamp } = require('../utils');

const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const AuthService = require('../services/auth.service');

class UsersController {
    constructor() {}

    /**
     * POST /api/users/login
     * Login a user
     */
    async login(req, res) {
        res.json({
            id: req.user.id,
            username: req.user.username,
            isAdmin: req.user.isAdmin,
        });
    }

    /**
     * POST /api/users/logout
     * Logout a user
     */
    async logout(req, res) {
        req.logout(() => {
            res.end();
        });
    }

    /**
     * GET /api/users/me
     * Get the current user's profile
     */
    async getProfile(req, res) {
        res.json({
            id: req.user.id,
            username: req.user.username,
            isAdmin: req.user.isAdmin,
        });
    }

    /**
     * GET /api/users/auth-token
     * Get a JWT token for the current user
     */
    async getToken(req, res) {
        const payload = {
            userId: req.user.id,
            username: req.user.username,
            admin: req.user.isAdmin,
        };
        const jwt = jsonwebtoken.sign(payload, environment.JWT_SECRET, {
            expiresIn: environment.JWT_EXPIRY,
        });
        res.json({ token: jwt });
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
