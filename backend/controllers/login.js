const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const storeUser = require('./../models/user')
const jwt = require('jsonwebtoken')

// Login
loginRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  // Find user by email
  const user = await storeUser.findOne({ email })
  const passwordCorrect = user === null
    ? false
    : bcrypt.compare(user.passwordHash, password)

  if (!user || !passwordCorrect) {
    return response.status(401).json({ error: 'Invalid email or password' })
  }

  // Generate a JWT
  const userForToken = {
    id: user._id,
    username: user.username,
    role: user.role
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: '1h',
  })

  response.status(200).json({
    token,
    username: user.username,
    email: user.email
  })
})

module.exports = loginRouter