const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
     productId: {
          type: String,
          required: true
     },
     linkProduct: {
          type: String,
          required: true
     },
     videoLink: {
          type: String,
          required: true
     },
     title: {
          type: String,
          required: true
     },
     price: {
          type: String,
          required: true
     },
     video: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Videos'
     }
}, {versionKey: false})

const ProductModels = mongoose.model('Products', ProductSchema)

module.exports = ProductModels