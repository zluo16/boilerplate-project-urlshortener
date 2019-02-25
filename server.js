'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./api');

const cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

// Connect to Mongo Database
mongoose.connect(process.env.MLAB_URI);

app.use(cors());

// Mount body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log to requests to console
app.use('/', function(req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use('/api', router);

app.listen(port, function () {
  console.log('Node.js listening ...');
});
