import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import '../styles/ProductsPage.css'

import productServices from './../services/product'

const ProductsPage = () => {
  
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productServices.getAll()
        setProducts(response.data)
      } catch (error) {
        console.error("Error fetching products : ", error)
      }
    }
    fetchProducts()
  }, [])

  return <div>
    <div className="produts-page">
      <h1>Products</h1>
      <div className="products-grid">
        {products.map((product) => {
          <ProductCard key={product.id} product={product} currency="$ "/>
        })}
      </div>
    </div>
  </div>
}

export default ProductsPage
