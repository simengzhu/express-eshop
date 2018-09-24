/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
const { check, validationResult } = require('express-validator/check');

// Connect to db
mongoose.connect('mongodb://localhost/eshopcart');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Initialize app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
// 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json())

// Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// Express Validator middleware
app.post('/user', [
  // username must be an email
  check('username').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 })
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => res.json(user));
});

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Set routes
var pages = require('./routes/pages.js');
var adminPages = require('./routes/admin_pages.js');

app.use('/admin/pages', adminPages);
app.use('/', pages);

// Start the server
var port = 3000;
app.listen(port, function() {
    console.log('Server started on port ' + port);
});

//const express = require('express')
//const app = express()
//const port = 3000
//
//app.get('/', (req, res) => res.send('Hello World!'))
//
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))

