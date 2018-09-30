/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();

// Get Product model
var Product = require('../models/product');

/*
 * GET /
 */
router.get('/', function(req, res) {
    Page.findOne({slug: 'home'}, function(err, page) {
        if (err) {
            console.log(err);
        }
        
        res.render('index', {
            title: page.title,
            content: page.content
        });
    });
});



// Exports
module.exports = router;
