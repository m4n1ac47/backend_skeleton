const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { verifyJWT } = require('./middleware/verify')
const { handle404 } = require('./middleware/404')
const authRoutes = require('./routes/auth.js')
const { PORT, MONGODB_URI } = require('./config')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(verifyJWT)
app.use('/auth', authRoutes)
app.use(handle404)

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()