/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();

// Get Product model
var Product = require('../models/product');

// Get Product model
var Category = require('../models/category');

/*
 * GET all products
 */
router.get('/', function (req, res) {

    Product.find(function (err, products) {
        if (err)
            console.log(err);

        res.render('all_products', {
            title: 'All products',
            products: products
        });
    });

});

/*
 * GET products by category
 */
router.get('/:category', function (req, res) {
    
    var categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function(err, c) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('cat_products', {
                title: c.title,
                products: products
            });
        });
    });

});

// Exports
module.exports = router;
