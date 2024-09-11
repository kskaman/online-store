import axios from 'axios'

// Define the base URL for the registration endpoint
const baseUrl = '/api/users/register'

// Function to register a new user
const register = async (newUser) => {
  // Send a POST request to the backend with user details
  const response = await axios.post(baseUrl, newUser)
  return response.data
}

export default { register }
