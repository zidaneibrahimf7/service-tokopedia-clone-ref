const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
     video: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Videos'
     },
     username: {
          type: String,
          required: true
     },
     comment: {
          type: String,
          required: true
     },
}, { timestamps: true, versionKey: false})

const CommentModels = mongoose.model('Comments', CommentSchema)

module.exports = CommentModels