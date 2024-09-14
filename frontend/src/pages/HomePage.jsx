import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import '../styles/HomePage.css'
import productServices from '../services/product'

const HomePage = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productServices.getAll()
        console.log("Products fetched:", response) // Debugging line
        setProducts(response) 
      } catch (error) {
        console.error("Error fetching products: ", error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      <header className="hero-section">
        <h1>Welcome to Our Online Store</h1>
        <p>Discover our collection of amazing products.</p>
        <button>Shop Now</button>
      </header>
      <section className="products-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} currency="$ " />
            ))
          ) : (
            <p>No products available</p> // Fallback if products array is empty
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage