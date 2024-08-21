const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
})

orderItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    }
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
}, {
  timestamps: true,
})

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Order', orderSchema)