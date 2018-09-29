/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');

// Product schema
var ProductSchema = mongoose.Schema({
   
    title: {
        type: String, 
        required: true
    }, 
    slug: {
        type: String, 
    }, 
    desc: {
        type: String, 
        required: true
    }, 
    category: {
        type: String, 
        required: true
    }, 
    price: {
        type: Number, 
        required: true
    },
    image: {
        type: String, 
    }
    
});

var Product = module.exports = mongoose.model('Product', ProductSchema);


