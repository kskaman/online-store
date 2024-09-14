const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']  // Basic email validation
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  address: {
    type: String,  // Street address
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,  // Postal or ZIP code
  },
  cardDetails: {
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvv: { type: String }
  }
}, {
  timestamps: true,
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash  // Do not return sensitive data
    delete returnedObject.cardDetails?.cvv  // Hide CVV from frontend for security
  }
})

module.exports = mongoose.model('User', userSchema)
