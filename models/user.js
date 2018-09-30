/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');

// User schema
var UserSchema = mongoose.Schema({
   
    name: {
        type: String, 
        required: true
    }, 
    email: {
        type: String, 
        required: true
    }, 
    username: {
        type: String, 
        required: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    admin: {
        type: Number, 
    }
    
});

var User = module.exports = mongoose.model('User', UserSchema);


