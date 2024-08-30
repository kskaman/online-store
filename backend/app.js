const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')

const productRouter = require('./controllers/products')
const cartRouter = require('./controllers/carts')
const orderRouter = require('./controllers/orders')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error :', error))


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use('/api/products', productRouter)


// Both Cart and Order needs the 'user' to be logged in

// every route for cart requires 'user' status, so we can use roleMiddleware globally
app.use('/api/cart', middleware.authMiddleware, middleware.roleMiddleware('user'),cartRouter)

// one route requires admin while others require 'user' status, so roleMiddleware is not used globally
app.use('/api/orders', middleware.authMiddleware, orderRouter)


// Should be at the last

// Unknown endpoints
app.use(middleware.unknownEndPoint)
// Error Handling
app.use(middleware.errorHandler)

module.exports = app
