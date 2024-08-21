const express = require('express')
const Order = require('../models/order')
const Cart = require('../models/cart')
const orderRouter = express.Router()

// Place a new Order
orderRouter.post('/', async (request, response, next) => {
  try {
    // Fetch the user's cart
    const cart = await Cart.findOne({ user: request.user._id })
      .populate('items.product')

    if (!cart || cart.items.length === 0) {
      return response.status(400).json({ message: 'Your cart is empty' })
    }

    // Calculate total price
    const totalPRice = cart.items.reduce((acc, item) => 
      acc + item.product.price * item.quantity, 0)
    
  }
})