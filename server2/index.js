'use strict';

const environment = require('./environment');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { body, validationResult } = require('express-validator');
const { expressjwt: jwt } = require('express-jwt');

// init express
const app = new express();
const port = 3002;
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

// JWT authentication for all routes
app.use(
    jwt({
        secret: environment.JWT_SECRET,
        algorithms: ['HS256'],
    })
);

app.use((err, req, res, next) => {
    console.error(err);
    if (err) {
        res.status(401).send({
            error: {
                code: err.code,
                message: 'Unauthorized',
            },
        });
    } else {
        next();
    }
});

const errorFormatter = ({ location, msg, path }) => {
    return `${location}[${path}]: ${msg}`;
};

/*** ROUTES ***/
app.post(
    '/api/ticket-estimate',
    [
        body('title').isString().replace(' ', '').not().isEmpty(),
        body('category').isString().replace(' ', '').not().isEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ errors: errors.array().map(errorFormatter) });
        }
        const estimateHours =
            (req.body.title.length + req.body.category.length) * 10 +
            Math.floor(Math.random() * 239 + 1);

        if (req.auth.admin) {
            res.json({ unit: 'hours', estimate: estimateHours });
        } else {
            res.json({
                unit: 'days',
                estimate: Math.round(estimateHours / 24),
            });
        }
    }
);

// activate the server
app.listen(port, () => {
    console.log(`Server2 listening at http://localhost:${port}`);
});
