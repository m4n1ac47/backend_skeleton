const { Router } = require('express')
const router = Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/user.js')
const { PRIVATE_KEY } = require('../config.js')

router.post('/register', (req, res) => {
  const newUser = new User(req.body)

  newUser.hash_password = bcrypt.hashSync(req.body.password, 10)

  newUser.save((err, user) => {
    if (err) {
      return res.status(400).send({ message: err })
    } else {
      user.hash_password = undefined
      return res.json(user)
    }
  })
})

router.post('/sign_in',  (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err

    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(400).json({ message: 'Authentication failed. Invalid user or password.' })
    }

    return res.json({ token: jwt.sign({ email: user.email, name: user.name, _id: user._id }, PRIVATE_KEY) })
  })
})

router.post('/tasks', loginRequired, profile)

function loginRequired(req, res, next) {
  if (req.user) {
    next()
  } else {
    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
}

function profile(req, res, next) {
  if (req.user) {
    return res.json(req.user);
  }
  else {
   return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = router