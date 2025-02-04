const mongoose = require('mongoose')

const VideosSchema = new mongoose.Schema({
     videoId: {
          type: String,
          required: true
     },
     urlImageThumbnail: {
          type: String,
          required: true
     },
     product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Products'
     }
}, {versionKey: false})

const VideosModel = mongoose.model('Videos', VideosSchema)

module.exports = VideosModel