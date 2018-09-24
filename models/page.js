/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');

// Page schema
var PageSchema = mongoose.Schema({
   
    title: {
        type: String, 
        required: true
    }, 
    slug: {
        type: String, 
    }, 
    content: {
        type: String, 
        required: true
    }, 
    sorting: {
        type: Number, 
    }
    
});

var Page = module.exports = mongoose.model('Page', PageSchema);


