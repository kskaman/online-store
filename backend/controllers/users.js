const express = require('express')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')
const storeUser = require('../models/user')
const middleware = require('../utils/middleware')
const userRouter = express.Router()

// Load environment variables
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10

// Register a new user
userRouter.post(
  '/register',
  [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (request, response, next) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() })
    }

    const { username, email, password } = request.body

    try {
      const existingUser = await storeUser.findOne({ email })
      if (existingUser) {
        return response.status(409).json({ error: 'Email already in use' })
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

      const user = new storeUser({
        username,
        email,
        passwordHash,
      })

      const savedUser = await user.save()

      // Return only non-sensitive fields
      return response.status(201).json({ username: savedUser.username, email: savedUser.email })
    } catch (error) {
      next(error)
    }
  }
)

// Create a new admin (Admin-only route)
userRouter.post(
  '/create-admin',
  middleware.authMiddleware,
  middleware.roleMiddleware('admin'),
  [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (request, response, next) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() })
    }

    const { username, email, password } = request.body

    try {
      const existingUser = await storeUser.findOne({ email })
      if (existingUser) {
        return response.status(409).json({ error: 'Email already in use' })
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

      const admin = new storeUser({
        username,
        email,
        passwordHash,
        role: 'admin'
      })

      const savedAdmin = await admin.save()

      // Return non-sensitive data
      return response.status(201).json({ username: savedAdmin.username, email: savedAdmin.email })
    } catch (error) {
      next(error)
    }
  }
)

// Promote a user to admin (Admin-only route)
userRouter.patch(
  '/promote/:id',
  middleware.authMiddleware,
  middleware.roleMiddleware('admin'),
  async (request, response, next) => {
    try {
      const user = await storeUser.findById(request.params.id)

      if (!user) {
        return response.status(404).json({ error: 'User not found' })
      }

      user.role = 'admin'
      const updatedUser = await user.save()

      return response.status(200).json({ username: updatedUser.username, role: updatedUser.role })
    } catch (error) {
      next(error)
    }
  }
)

// Get all admins (Admin-only route)
userRouter.get(
  '/admins',
  middleware.authMiddleware,
  middleware.roleMiddleware('admin'),
  async (request, response, next) => {
    try {
      const limit = parseInt(request.query.limit) || 10
      const page = parseInt(request.query.page) || 1

      const admins = await storeUser.find({ role: 'admin' })
        .skip((page - 1) * limit)
        .limit(limit)

      response.json(admins)
    } catch (error) {
      next(error)
    }
  }
)

// Get all regular users (Admin-only route)
userRouter.get(
  '/users',
  middleware.authMiddleware,
  middleware.roleMiddleware('admin'),
  async (request, response, next) => {
    try {
      const limit = parseInt(request.query.limit) || 10
      const page = parseInt(request.query.page) || 1

      const users = await storeUser.find({ role: 'user' })
        .skip((page - 1) * limit)
        .limit(limit)

      response.json(users)
    } catch (error) {
      next(error)
    }
  }
)

// Update User Address and Card Details (Ensure not storing CVV)
userRouter.put(
  '/info',
  middleware.authMiddleware,
  [
    body('address').optional().isString(),
    body('city').optional().isString(),
    body('postalCode').optional().isString(),
    body('cardNumber').optional().isCreditCard().withMessage('Invalid credit card number'),
    body('expiryDate').optional().isLength({ min: 5, max: 5 }).withMessage('Invalid expiry date (MM/YY)')
  ],
  async (request, response, next) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() })
    }

    try {
      const { address, city, postalCode, cardNumber, expiryDate } = request.body
      const user = await storeUser.findById(request.user.id)

      if (!user) {
        return response.status(404).json({ error: 'User not found' })
      }

      // Update user details
      user.address = address || user.address
      user.city = city || user.city
      user.postalCode = postalCode || user.postalCode
      user.cardDetails = {
        cardNumber: cardNumber || user.cardDetails.cardNumber,
        expiryDate: expiryDate || user.cardDetails.expiryDate
      }

      const updatedUser = await user.save()

      response.json(updatedUser)
    } catch (error) {
      next(error)
    }
  }
)

// Get User Info
userRouter.get(
  '/info',
  middleware.authMiddleware,
  async (request, response, next) => {
    try {
      const user = await storeUser.findById(request.user.id)

      if (!user) {
        return response.status(404).json({ error: 'User not found' })
      }

      response.json(user)
    } catch (error) {
      next(error)
    }
  }
)

module.exports = userRouter
