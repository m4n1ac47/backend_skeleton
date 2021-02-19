const { Schema, model } = require('mongoose')

const RefreshTokenSchema = new Schema({
  refreshToken: String
}, { versionKey: false })

const RefreshToken = model('RefreshToken', RefreshTokenSchema)

module.exports = { RefreshToken }