const bcrypt = require('bcrypt')
const storeUser = require('../models/user')
const userRouter = require('express').Router()


// Register a new user
userRouter.post('/register', async (request, response) => {
  const { username, email, password } = request.body

  // Check if user already exists
  const existingUSer = await storeUser.find({ email })
  if (existingUSer) {
    return response.status(400).json({ error: 'Email already in use' })
  }

  // Hash the password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Create and save the user
  const user = new storeUser({
    username,
    email,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const users = await storeUser.find({})
  response.json(users)
})

module.exports = userRouter