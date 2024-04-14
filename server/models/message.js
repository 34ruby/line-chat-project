const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  sendType: {
    type: String,
    enum: ['send', 'receive'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  nickname: String,
  profilePictureUrl: String,
  createdAt: {
    type: Date,
    required: true
  },
})

const message = mongoose.model('message', messageSchema)

module.exports = message