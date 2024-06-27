'use strict';

const express = require('express');
const router = express.Router();

const passport = require('passport');

const usersController = require('../controllers/users');

// Database context middleware
router.use(require('../middlewares/dbContext'));

router.post('/login', passport.authenticate('local'), usersController.login);
router.get('/passhash', usersController.passhash);

module.exports = router;
