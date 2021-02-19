const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET } = require('../config')

async function verifyJWT(req, res, next) {
  if (req.headers?.authorization?.split(' ')[0] === 'Bearer') {
    try {
      const decode = await jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET)
      req.user = decode
    } catch (err) {
      req.user = undefined
    }
    next()
  } else {
    req.user = undefined
    next()
  }
}

module.exports = { verifyJWT }