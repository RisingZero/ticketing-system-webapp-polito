'use strict';

const express = require('express');
const router = express.Router();

const AuthService = require('../services/auth.service');
const requireAuth = require('../middlewares/requireAuth');

const usersController = require('../controllers/users');

// Database context middleware
router.use(require('../middlewares/dbContext'));

router.post('/login', AuthService.loginHandler, usersController.login);
router.post('/logout', usersController.logout);
router.get('/me', requireAuth(), usersController.getProfile);
router.get('/auth-token', requireAuth(), usersController.getToken);
//router.get('/passhash', usersController.passhash);

module.exports = router;
