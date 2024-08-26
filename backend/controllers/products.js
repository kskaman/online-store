const productRouter = require('express').Router()
const roleMiddleware = require('./../utils/middleware')
const Product = require('../models/product')


// Get all products
productRouter.get('/', async (request, response, next) => {
  try {
    const products = await Product.find({})
    response.json(products)
  } catch (error) {
    next(error)
  }
})

// Get a product by ID
productRouter.get('/:id', async (request, response, next) => {
  try {
    const product = await Product.findById(request.params.id)
    if (!product) {
      return response.status(404).json({ message: 'Product not found' })
    }
    response.json(product)
  } catch (error) {
    next(error)
  }
})


// Create a new product (Admin-only)
productRouter.post('/', roleMiddleware('admin'), async (request, response, next) => {
  try {
    const newProduct = new Product(request.body)
    const savedProduct = await newProduct.save()
    response.status(201).json(savedProduct)
  } catch (error) {
    next(error)
  }
})


// Update a product (Admin-only)
productRouter.put('/:id', roleMiddleware('admin'), async (request, response, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new : true, runValidators: true }
    )
    if (!updatedProduct) {
      return response.status(404).json({ message: 'Product not found' })
    }
    response.json(updatedProduct)
  } catch (error) {
    next(error)
  }
})

// Delete a product (Admin-only)
productRouter.delete('/:id', roleMiddleware('admin'), async (request, response, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(request.params.id)
    if (!deletedProduct) {
      return response.status(404).json({ message: 'Product not found' })
    }
    response.json({ message: 'Product deleted' })
  } catch (error) {
    next(error)
  }
})

module.exports = productRouter