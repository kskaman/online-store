import axios from 'axios'

// Set token in headers (Use cookies if possible)
let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// Login function
const login = async (credentials) => {
  const response = await axios.post('/api/login', credentials)
  return response.data
}

// Register function
const register = async (newUser) => {
  const response = await axios.post('/api/user/register', newUser)
  return response.data
}

// Get user info
const getUserInfo = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get('/api/user/info', config)
  return response.data
}

// Update user info
const updateUserInfo = async (data) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put('/api/user/info', data, config)
  return response.data
}

export default { login, register, getUserInfo, updateUserInfo, setToken }
