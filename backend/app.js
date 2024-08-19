const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const productRouter = require('./controllers/products')
const cartRouter = require('./controllers/carts')
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
app.use('/api/cart', cartRouter)

// Should be at the last

// Unknown endpoints
app.use(middleware.unknownEndpoint)
// Error Handling
app.use(middleware.errorHandler)

module.exports = app
