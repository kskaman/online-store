import { useState } from 'react'
import productService from '../services/product'

import PropTypes from 'prop-types'

const AddProductPage = ({ token }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    imageUrl: ''
  })

  const handleChange = (event) => {
    setNewProduct({
       ...newProduct,
       [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
        const addedProduct = await productService.addProduct(newProduct, token);
        console.log('Product added:', addedProduct);
        setNewProduct({ name: '', price: '', category: '', description: '', stock: '', imageUrl: '' });
      } catch (error) {
        console.error('Error adding product:', error);
      }
    };
  
  return (
    <div>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={newProduct.name} onChange={handleChange} placeholder="Product Name" />
        <input type="number" name="price" value={newProduct.price} onChange={handleChange} placeholder="Price" />
        <input type="text" name="category" value={newProduct.category} onChange={handleChange} placeholder="Category" />
        <textarea name="description" value={newProduct.description} onChange={handleChange} placeholder="Description" />
        <input type="number" name="stock" value={newProduct.stock} onChange={handleChange} placeholder="Stock" />
        <input type="text" name="imageUrl" value={newProduct.imageUrl} onChange={handleChange} placeholder="Image URL" />
        <button type="submit">Add Product</button>
      </form>
    </div>
  )
}

AddProductPage.propTypes = {
  token: PropTypes.string.isRequired,
}

export default AddProductPage