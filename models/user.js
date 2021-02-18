const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const UserShema = new Schema({
  name: {
    type: String,
    trim: true,
    requered: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  hash_password: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

UserShema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password)
}

const User = model('User', UserShema)

module.exports = { User }