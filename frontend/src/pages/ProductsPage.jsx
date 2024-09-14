import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import '../styles/ProductsPage.css'
import productServices from '../services/product'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)  // Loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productServices.getAll()
        setProducts(response) 
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products: ", error)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="products-page">
      <h1>Products</h1>
      <div className="products-grid">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} currency="$ " />
          ))
        ) : (
          <p>No products available</p> // Fallback if products array is empty
        )}
      </div>
    </div>
  )
}

export default ProductsPage
