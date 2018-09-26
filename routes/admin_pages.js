/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');

/*
 * GET pages index
 */
router.get('/', function(req, res) {
    res.send('admin area');
});

/*
 * GET add page index
 */
router.get('/add-page', function(req, res) {
    
    var title = "";
    var slug = "";
    var content = "";
    
    res.render('admin/add_page', {
        title: title, 
        slug: slug,
        content: content
    })
    
});

/*
 * POST add page index
 */
router.use(express.json());
router.post('/add-page', [
  check('title', 'Title must have a value.').not().isEmpty(),
  check('content', 'Content must have a value.').not().isEmpty(),
], (req, res) => {
  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  if (slug == "") {
      slug = title.replace(/\s+/g, '-').toLowerCase();
  }
  
  var content = req.body.content;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.log('errors');
      res.render('admin/add_page', {
        errors: errors,
        title: title, 
        slug: slug,
        content: content
    });
  } else {
      console.log('success');
  }

});

// Exports
module.exports = router;

