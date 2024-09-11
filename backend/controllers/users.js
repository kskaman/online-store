const bcrypt = require('bcrypt')
const storeUser = require('../models/user')
const userRouter = require('express').Router()

const middleware = require('../utils/middleware')

// Register a new user
userRouter.post('/register', async (request, response) => {
  const { username, email, password } = request.body

  // Check if user already exists
  const existingUser = await storeUser.findOne({ email }) // Change find() to findOne()
  if (existingUser) {
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

// Create a new admin (Admin only route)
userRouter.post('/create-admin', middleware.authMiddleware, middleware.roleMiddleware('admin'), async (request, response) => {
  const { username, email, password } = request.body

  const existingUser = await storeUser.findOne({ email }) // Use findOne() instead of find()
  if (existingUser) {
    return response.status(400).json({ error: 'Email already in use' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const admin = new storeUser({
    username,
    email,
    passwordHash,
    role: 'admin' // Manually create admins with 'admin' role
  })

  const savedAdmin = await admin.save()
  response.status(201).json(savedAdmin)
})

// Promote a user to admin (Admin only route)
userRouter.patch('/promote/:id', middleware.authMiddleware, middleware.roleMiddleware('admin'), async (request, response) => {
  const user = await storeUser.findById(request.params.id)

  if (!user) {
    return response.status(404).json({ error: 'User not found' })
  }

  user.role = 'admin'
  const updatedUser = await user.save()
  response.json(updatedUser)
})

// Get all admins (Admin only route)
userRouter.get('/admins', middleware.authMiddleware, middleware.roleMiddleware('admin'), async (request, response) => {
  try {
    const admins = await storeUser.find({ role: 'admin' })
    response.json(admins)
  } catch (error) {  // Include the error in the response
    response.status(500).json({ error: 'Error fetching admins: ' + error.message })
  }
})

// Get all regular users (Admin only route)
userRouter.get('/users', middleware.authMiddleware, middleware.roleMiddleware('admin'), async (request, response) => {
  try {
    const users = await storeUser.find({ role: 'user' })
    response.json(users)
  } catch (error) {  // Include the error in the response
    response.status(500).json({ error: 'Error fetching users: ' + error.message })
  }
})

module.exports = userRouter
