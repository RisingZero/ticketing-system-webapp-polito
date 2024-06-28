'use strict';

const express = require('express');
const router = express.Router();

const passport = require('passport');
const requireAuth = require('../middlewares/requireAuth');

const usersController = require('../controllers/users');

// Database context middleware
router.use(require('../middlewares/dbContext'));

router.post('/login', passport.authenticate('local'), usersController.login);
router.post('/logout', usersController.logout);
router.get('/auth-token', requireAuth(), usersController.getToken);
//router.get('/passhash', usersController.passhash);

module.exports = router;
