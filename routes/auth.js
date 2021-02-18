const { Router } = require('express')
const router = Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/user.js')
const { PRIVATE_KEY } = require('../config.js')

router.post('/register', async (req, res) => {
  const newUser = new User(req.body)

  try {
    newUser.hash_password = await bcrypt.hash(req.body.password, 10)

    const user = await newUser.save()

    user.hash_password = undefined

    return res.json(user)
  } catch (err) {
    return res.status(400).send({ message: err })
  }
})

router.post('/sign_in',  async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    const failAuth = !user || !user.comparePassword(req.body.password)

    return failAuth
      ? res.status(400).json({ message: 'Authentication failed. Invalid user or password.' })
      : res.json({ token: jwt.sign({ email: user.email, name: user.name, _id: user._id }, PRIVATE_KEY) })

  } catch (err) {
    if (err) return res.status(400).json({ message: err })
  }
})

router.post('/tasks', loginRequired, profile)

function loginRequired(req, res, next) {
  if (req.user) {
    next()
  } else {
    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
}

function profile(req, res) {
  return req.user
    ? res.json(req.user)
    : res.status(401).json({ message: 'Invalid token' })
}

module.exports = router