/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

// Get Users model
var User = require('../models/user');

/*
 * GET register
 */
router.get('/register', function(req, res) {
    res.render('register', {
        title: "Register"
    });
});

/*
 * POST register
 */
router.use(express.json());
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email is required').isEmail(),
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  check('password2', 'Passwords do not match').custom((value, { req }) => value === req.body.password)
], (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('register', {
            errors: errors,
            user: null,
            title: 'Register'
        });
    } else {
        User.findOne({username: username}, function (err, user) {
            if (err)
                console.log(err);

            if (user) {
                req.flash('danger', 'Username exists, choose another');
                res.redirect('/users/register');
            } else {
                var user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    admin: 0
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err)
                            console.log(err);

                        user.password = hash;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success', 'You are now registered');
                                res.redirect('/users/login')
                            }
                        });
                    });
                });
            }
        });
    }
});

/*
 * GET login
 */
router.get('/login', function (req, res) {

    if (res.locals.user) res.redirect('/');
    
    res.render('login', {
        title: 'Log in'
    });

});

/*
 * POST login
 */
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    
});

// Exports
module.exports = router;
