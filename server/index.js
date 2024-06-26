'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// init express
const app = new express();
const port = 3001;

// use morgan for logging
app.use(morgan('dev'));
// use body-parser middleware
app.use(bodyParser.json());

// setup routes
app.use('/api/tickets', require('./routes/tickets'));

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
