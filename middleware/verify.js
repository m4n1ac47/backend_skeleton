const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../config')

function verifyJWT(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    jwt.verify(req.headers.authorization.split(' ')[1], PRIVATE_KEY, (err, decode) => {
      if (err) req.user = undefined
      req.user = decode
      next()
    })
  } else {
    req.user = undefined
    next()
  }
}

module.exports = { verifyJWT }