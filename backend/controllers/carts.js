const express = require('express')
const Cart = require('./models/cart')
const CartItem = require('./models/cartItem')
const { populate } = require('../models/cart')
const cartRouter = express.Router()

// Add or Update a Cart Item
cartRouter.post('/', async (request, response, next) => {
  try {
    const { productId, quantity } = request.body

    // Find the cart for the logged-in user (assuming user is in request.user)
    let cart = await Cart.findOne({ user: request.user.id })
    if (!cart) {
      cart = new Cart({ user: request.user.id, items: [] })
    }

    // Check if the product is already in the cart
    let cartItem = await CartItem.findOne({
      product: productId,
      quantity,
      user: request.user.id })
    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity
      await cartItem.save()
    } else {
      // Add new item to cart
      cartItem = new CartItem({
        product: productId,
        quantity,
        user: request.user.id })
      await cartItem.save()
      cart.items.push(cartItem.id)
    }

    await cart.save()
    response.status(201).json(cartItem)
  } catch (error) {
    next(error)
  }
})

// Get All Cart Items
cartRouter.get('/', async (request, response, next) => {
  try {
    const cart = await Cart.findOne({ user: request.user.id }).populate({
      path: 'items',
      populate: { path: 'product' },
    })
    if (!cart) {
      return response.status(404).json({ message: 'Cart not found' })
    }
    response.json(cart)
  } catch (error) {
    next(error)
  }
})

// Delete a single Cart Item
cartRouter.delete('./:itemId', async (request, response, next) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(request.params.itemId)
    if (!cartItem) {
      return response.status(404).json({ message: 'Cart item not found' })
    }

    // Remove the item from the cart
    await Cart.updateOne(
      { user: request.user.id },
      { $pull: { items: request.params.itemId } })

    response.json({ message: 'Cart item removed' })
  } catch (error) {
    next(error)
  }
})


// Clear the Entire Cart
cartRouter.delete('/', async (request, response, next) => {
  try {
    const cart = await Cart.findOne({ user: request.user.id })
    if (!cart) {
      return response.status(404).json({ message: 'Cart not found' })
    }

    // Remove all items from the cart
    await CartItem.deleteMany({ user: request.user.id })
    cart.items = []
    await cart.save()

    response.json({ message: 'Cart cleared' })
  } catch (error) {
    next(error)
  }
})

module.exports = cartRouter