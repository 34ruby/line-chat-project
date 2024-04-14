const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },    
  nickname: String,
  profilePictureUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const user = mongoose.model('user', UserSchema)

module.exports = user
