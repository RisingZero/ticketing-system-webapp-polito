'use strict';

const environment = require('./environment');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// init express
const app = new express();
const port = 3001;
app.use(morgan('dev'));
app.use(express.json());

// enable CORS
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
    })
);

// setup passport authentication
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AuthService = require('./services/auth.service');
passport.use(new LocalStrategy(AuthService.verify));
passport.serializeUser(AuthService.serializeUser);
passport.deserializeUser(AuthService.deserializeUser);

// setup session
const session = require('express-session');
app.use(
    session({
        secret: environment.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: app.get('env') === 'production' ? true : false,
        },
    })
);
app.use(passport.authenticate('session'));

// setup routes
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/users', require('./routes/users'));

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
