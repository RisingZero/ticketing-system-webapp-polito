'use strict';

const express = require('express');
const morgan = require('morgan');

// init express
const app = new express();
const port = 3001;

// use morgan for logging
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
