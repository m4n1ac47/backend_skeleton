const { Router } = require('express')
const router = Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/user.js')
const { RefreshToken } = require('../models/refresh')
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE } = require('../config.js')

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

router.post('/token',  async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user?.comparePassword(req.body.password)) {
      res.status(400).json({ message: 'Authentication failed. Invalid user or password.' })
    } else {
      const JWTPayload = { email: user.email, name: user.name, _id: user._id }
      const access = jwt.sign(JWTPayload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE })
      const refresh = jwt.sign(JWTPayload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE })

      refreshToken = new RefreshToken({ refreshToken: refresh })
      await refreshToken.save()

      return res.json({ access, refresh })
    }
  } catch (err) {
    return res.status(400).json({ message: err })
  }
})

router.post('/refresh', async (req, res) => {
  try {
    const user = await jwt.verify(req.body.refresh, REFRESH_TOKEN_SECRET)
    const isDeleted = await RefreshToken.findOneAndRemove({ refreshToken: req.body.refresh })

    if (!isDeleted) {
      return res.status(400).json({ message: 'Refresh token is not found' })
    }

    const JWTPayload = { email: user.email, name: user.name, _id: user._id }
    const access = jwt.sign(JWTPayload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE })
    const refresh = jwt.sign(JWTPayload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE })

    refreshToken = new RefreshToken({ refreshToken: refresh })

    await refreshToken.save()

    return res.json({ access, refresh })
  } catch (err) {
    return res.status(400).json({ message: err })
  }
})

// Тестовые таски

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