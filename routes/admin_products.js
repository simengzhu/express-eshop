/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var path = require('path');
const { check, validationResult } = require('express-validator/check');

// Get Product model
var Product = require('../models/product');

// Get Category model
var Category = require('../models/category');

/*
 * GET products index
 */
router.get('/', function(req, res) {
    var count;
    Product.count(function(err, c){
        count = c;
    });
    
    Product.find(function(err, products) {
        res.render('admin/products', {
            products: products, 
            count: count
        });
    });
});

/*
 * GET add product
 */
router.get('/add-product', function(req, res) {
    
    var title = "";
    var desc = "";
    var price = "";
    
    Category.find(function(err, categories){ 
        res.render('admin/add_product', {
            title: title, 
            desc: desc,
            categories: categories,
            price: price
        });
    });
    
});

/*
 * POST add product
 */
router.use(express.json());
router.post('/add-product/', [
  check('title', 'Title must have a value.').not().isEmpty(),
  check('desc', 'Description must have a value.').not().isEmpty(),
  check('price', 'Price must have a value.').isDecimal(),
  check('image', 'You must upload a valid image').custom((value, {req}) => {
      var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
      var extension = (path.extname(imageFile)).toLowerCase();
      switch (extension) {
          case '.jpg': 
              return '.jpg';
          case '.jpeg': 
              return '.jpeg';
          case '.png': 
              return '.png';
          case '': 
              return '.jpg';
          default:
              return false;
      }
  })
], (req, res) => {
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        Category.find(function(err, categories){ 
            res.render('admin/add_product', {
                errors: errors,
                title: title, 
                desc: desc,
                categories: categories,
                price: price
            });
        });
    } else {
        Product.findOne({slug: slug}, function(err, product) {
            if (product) {
                req.flash('danger', 'Product title exists, choose another.');
                Category.find(function(err, categories){ 
                    res.render('admin/add_product', {
                        title: title, 
                        desc: desc,
                        categories: categories,
                        price: price
                    });
                });
            } else {
                var price2 = parseFloat(price).toFixed(2);
                var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
                var product = new Product({
                   title: title, 
                   slug: slug, 
                   desc: desc, 
                   price: price2, 
                   category: category, 
                   image: imageFile
                });            
                
                product.save(function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    
                    mkdirp('public/product_images/' + product._id, function(err) {
                        return console.log(err);
                    });
                    
                    mkdirp('public/product_images/' + product._id + '/gallery', function(err) {
                        return console.log(err);
                    });
                    
                    mkdirp('public/product_images/' + product._id + '/gallery/thumbs', function(err) {
                        return console.log(err);
                    });
                    
                    if (imageFile != '') {
                        var productImage = req.files.image;
                        var validPath = 'public/product_images/' + product._id + '/' + imageFile;
                        
                        productImage.mv(validPath, function(err) {
                            return console.log(err);
                        });
                    }

                    req.flash('success', 'Product added');
                    res.redirect('/admin/products');
                });
            }
        });
    }
});

/*
 * GET edit product
 */
router.get('/edit-product/:id', function(req, res) {    
    
    var errors;
    if (req.session.errors) {
        errors = req.session.errors;
    }
    req.session.errors = null;
    
    Category.find(function(err, categories){ 
        Product.findById(req.params.id, function(err, p) {
            if (err) {
                console.log(err);
                res.redirect('/admin/products');
            } else {
                var galleryDir = 'public/product_images/' + p._id + '/gallery';
                var galleryImages = null;
                
                fs.readdir(galleryDir, function(err, files) {
                    if (err) {
                        console.log(err);
                    } else {
                        galleryImages = files;
                    }
                    
                    res.render('admin/edit_product', {
                        title: p.title, 
                        errors: errors,
                        desc: p.desc,
                        categories: categories,
                        category: p.category.replace(/\s+/g, '-').toLowerCase(),
                        price: parseFloat(p.price).toFixed(2), 
                        image: p.image, 
                        galleryImages: galleryImages, 
                        id: p.id
                    });
                });
            }
        });
    });
});

/*
 * POST edit product
 */
router.post('/edit-product/:id', [
  check('title', 'Title must have a value.').not().isEmpty(),
  check('desc', 'Description must have a value.').not().isEmpty(),
  check('price', 'Price must have a value.').isDecimal(),
  check('image', 'You must upload a valid image').custom((value, {req}) => {
      var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
      var extension = (path.extname(imageFile)).toLowerCase();
      switch (extension) {
          case '.jpg': 
              return '.jpg';
          case '.jpeg': 
              return '.jpeg';
          case '.png': 
              return '.png';
          case '': 
              return '.jpg';
          default:
              return false;
      }
  })
], (req, res) => {
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var pimage = req.body.pimage;
    var id = req.params.id;  
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors;
        res.redirect('/admin/products/edit-product/' + id);
    } else {
        Product.findOne({slug: slug, _id: {'$ne':id}}, function(err, product) {
            if (err) {
                console.log(err);
            }
            
            if (product) {
                req.flash('danger', 'Product title exists, please choose another.')
                res.redirect('/admin/products/edit-product/' + id);
            } else {
                var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
                Product.findById(id, function(err, product) {
                    if (err) {
                        console.log(err);
                    }
                    
                    product.title = title;
                    product.slug = slug;
                    product.desc = desc;
                    product.price = parseFloat(price).toFixed(2);
                    product.category = category;
                    if (imageFile != "") {
                        product.image = imageFile;
                    }
                    
                    product.save(function(err) {
                        if (err) {
                            console.log(err);
                        }
                        
                        if (imageFile != "") {
                            if (pimage != "") {
                                fs.remove('public/product_images/' + id + '/' + pimage, function(err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }
                            
                            var productImage = req.files.image;
                            var validPath = 'public/product_images/' + id + '/' + imageFile;

                            productImage.mv(validPath, function(err) {
                                return console.log(err);
                            });
                        }
                        
                        req.flash('success', 'Product edited');
                        res.redirect('/admin/products/edit-product/' + id);
                    });
                });                 
            }
        });
    }
});

/*
 * GET delete page
 */
router.get('/delete-page/:id', function(req, res) {
    Page.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return console.log(err);
        } 
        
        req.flash('success', 'Page deleted');
        res.redirect('/admin/pages/');
    });
});

// Exports
module.exports = router;

