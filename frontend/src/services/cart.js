import axios from 'axios'

// Base URL for the cart-related routes
const baseUrl = '/api/cart'

// Get all cart items
const getCartItems = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// Add or update a cart item
const addToCart = async (productId, quantity) => {
  const response = await axios.post(baseUrl, { productId, quantity })
  return response.data
}

// Delete a single cart item
const deleteCartItem = async (itemId) => {
  const response = await axios.delete(`${baseUrl}/${itemId}`)
  return response.data
}

// Clear the entire cart
const clearCart = async () => {
  const response = await axios.delete(baseUrl)
  return response.data
}

export default {
  getCartItems,
  addToCart,
  deleteCartItem,
  clearCart
}
