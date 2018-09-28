/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');

// Get Category model
var Category = require('../models/category');

/*
 * GET category index
 */
router.get('/', function(req, res) {
    Category.find(function(err, categories) { 
        if (err) {
            return console.log(err);
        }
        
        res.render('admin/categories', {
            categories: categories
        });
    });
});

/*
 * GET add category
 */
router.get('/add-category', function(req, res) {
    
    var title = "";
    
    res.render('admin/add_category', {
        title: title
    })
    
});

/*
 * POST add category
 */
router.use(express.json());
router.post('/add-category', [
  check('title', 'Title must have a value.').not().isEmpty(),
], (req, res) => {
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('errors');
        res.render('admin/add_category', {
            errors: errors,
            title: title
        });
    } else {
        Category.findOne({slug: slug}, function(err, category) {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/add_category', {
                    title: title
                });
            } else {
                var category = new Category({
                   title: title, 
                   slug: slug
                });            
                
                category.save(function(err) {
                    if (err) {
                        return console.log(err);
                    }

                    req.flash('success', 'Category added');
                    res.redirect('/admin/categories');
                });
            }
        });
    }
});

/*
 * GET edit category
 */
router.get('/edit-category/:id', function(req, res) {    
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            return console.log(err);
        }
        
        res.render('admin/edit_category', {
            title: category.title, 
            id: category._id
        });
    });
});

/*
 * POST edit category
 */
router.post('/edit-category/:id', [
  check('title', 'Title must have a value.').not().isEmpty(),
], (req, res) => {
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('errors');
        res.render('admin/edit_category', {
            errors: errors,
            title: title, 
            id: id
        });
    } else {
        Category.findOne({slug: slug, _id:{'$ne':id}}, function(err, category) {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/edit_category', {
                    title: title, 
                    id: id
                });
            } else {
                Category.findById(id, function(err, category){
                    if (err) {
                        return console.log(err);
                    }
                    
                    category.title = title;
                    category.slug = slug;
                    
                    category.save(function(err) {
                        if (err) {
                            return console.log(err);
                        }

                        req.flash('success', 'Category edited');
                        res.redirect('/admin/pages/edit-page/'+page.slug);
                    });
                });
            }
        });
    }
});

/*
 * GET delete category
 */
router.get('/delete-category/:id', function(req, res) {
    Category.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return console.log(err);
        } 
        
        req.flash('success', 'Category deleted');
        res.redirect('/admin/categories/');
    });
});

// Exports
module.exports = router;

