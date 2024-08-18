const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const productRouter = require('./controllers/products')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error :', err))


app.use(cors())
app.use(static('dist'))
app.use(express.json())

app.use('/api/products', productRouter)


// Should be at the last

// Unknown endpoints
app.use(middleware.unknownEndpoint);
// Error Handling
app.use(middleware.errorHandler)

module.exports = app
