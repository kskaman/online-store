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
    : await bcrypt.compare(password, user.passwordHash)

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
    expiresIn: 60*30,
  })

  // Token expires in 2 hour
  response.status(200).json({
    token,
    username: user.username,
    email: user.email,
    role: user.role
  })
})

module.exports = loginRouter