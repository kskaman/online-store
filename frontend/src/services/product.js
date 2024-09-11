import axios from 'axios'
const baseUrl = '/api/products'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getProductById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}$`)
  return response.data
}

const addProduct = async (newProduct, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`}
  }
  const response = await axios.post(baseUrl, newProduct, config)
  return response.data
}

const deleteProduct = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const updateProduct = async (id, updatedData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}`}
  }

  const response = await axios.put(`${baseUrl}/${id}`, updatedData, config)
  return response.data
}

export default { 
  getAll, 
  getProductById,
  addProduct, 
  deleteProduct, 
  updateProduct 
}