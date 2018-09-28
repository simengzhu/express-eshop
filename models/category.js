/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');

// Category schema
var CategorySchema = mongoose.Schema({
   
    title: {
        type: String, 
        required: true
    }, 
    slug: {
        type: String, 
    }
    
});

var Category = module.exports = mongoose.model('Category', CategorySchema);


