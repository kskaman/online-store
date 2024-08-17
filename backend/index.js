require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error :', err))

const productsRouter = require('./controllers/products')
app.use('/api', productsRouter)

app.get('/', (request, response) => {
    response.send('Server is running')
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})