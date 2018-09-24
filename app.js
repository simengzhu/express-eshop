/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

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

app.get('/', function(req, res) {
//    res.send('working');
    res.render('index', {
        title: 'Home'
    });
});

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

