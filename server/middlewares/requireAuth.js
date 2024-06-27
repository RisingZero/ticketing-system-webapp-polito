'use strict';

const AuthService = require('../services/auth.service');

const requireAuth = (role = AuthService.Roles.USER) => {
    return (req, res, next) => {
        if (!req.isAuthenticated())
            return res.status(401).json({ message: 'Not authenticated' });

        if (role === AuthService.Roles.ADMIN && !req.user.isAdmin)
            return res.status(403).json({ message: 'Not authorized' });

        next();
    };
};

module.exports = requireAuth;
