const express = require('express')
const Order = require('../models/order')
const Cart = require('../models/cart')
const orderRouter = express.Router()
const middleware = require('./../utils/middleware')


// Place a new Order
orderRouter.post('/', middleware.roleMiddleware('user') ,async (request, response, next) => {
  try {
    // Fetch the user's cart
    const cart = await Cart.findOne({ user: request.user.id })
      .populate('items.product')

    if (!cart || cart.items.length === 0) {
      return response.status(400).json({ message: 'Your cart is empty' })
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((acc, item) =>
      acc + item.product.price * item.quantity, 0)

    // Create the order
    const order = new Order({
      user: request.user.id,
      orderItems: cart.items.map(item => ({
        product: item.product.id,
        quantity: item.quantity
      })),
      shippingAddress: request.body.shippingAddress,
      paymentStatus: 'Pending',
      totalPrice: totalPrice,
      orderStatus: 'Processing',
    })

    const savedOrder = await order.save()

    // Clear the cart after placing the order
    cart.items = []
    await cart.save()

    response.status(201).json(savedOrder)
  } catch (error) {
    next(error)
  }

  // Get All Orders for the Logged-In User
  orderRouter.get('/', middleware.roleMiddleware('user') ,async (request, response, next) => {
    try {
      const orders = await Order.find({ user: request.user.id })
        .populate('orderItems.product')
      response.json(orders)
    }  catch (error) {
      next(error)
    }
  })
})

// Get Details of a Specific Order
orderRouter.get('/:id', middleware.roleMiddleware('user'), async (request, response, next) => {
  try {
    const order = await Order.findById(request.params.id)
      .populate('orderItems.product')

    if (!order) {
      return response.status(404).json({ message: 'Order not found' })
    }

    if (order.user.toString() !== request.user.id.toString()) {
      return response.status(403).json({ message: 'Access denied' })
    }

    response.json(order)
  } catch (error) {
    next(error)
  }
})

// Update Order Status (Admin-Only)
orderRouter.put('/:id', middleware.roleMiddleware('admin'), async (response, request, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      request.params.id,
      { orderStatus: request.body.orderStatus },
      { new: true, runValidators: true }
    )

    if (!updatedOrder) {
      return response.status(404).json({ message: 'Order not found' })
    }

    response.json(updatedOrder)
  } catch (error) {
    next(error)
  }
})

// Cancel an Order
orderRouter.delete('/:id', middleware.roleMiddleware('user'), async (request, response, next) => {
  try {
    const order = await Order.findById(request.params.id)

    if (!order) {
      return response.status(404).json({ message: 'Order not found' })
    }

    if (order.user.toString() !== request.user.id.toString()) {
      return response.status(403).json({ message: 'Access denied' })
    }

    // Only allow cancellation if  the order is still in a cancelale state
    if (order.orderStatus !== 'Processing') {
      return response.status(400).json({ message: 'Order cannot be cancelled ' })
    }

    order.orderStatus = 'Cancelled'
    await order.save()

    response.json({ messgae: 'Order cancelled' })
  } catch (error) {
    next(error)
  }
})

module.exports = orderRouter