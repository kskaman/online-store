const productsRouter = require('express').Router() 

const Product = require('../models/product')

// Create a new product
productsRouter.post('/products', async (request, response) => {
  try {
    const newProduct = new Product(request.body)
    const savedProduct = await newProduct.save()
    response.status(201).json(savedProduct)
  } catch (error) {
    response.status(400).json(({ error : error.message }))
  }
}) 

// Get all products
productsRouter.get('/products', async (request, response) => {
  try {
    const products = await Product.find({})
    response.json(products)
  } catch (error) {
    response.status(500).json({ error : error.message })
  }
})

module.exports = productsRouter