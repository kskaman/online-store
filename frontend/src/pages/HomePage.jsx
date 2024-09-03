import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import '../styles/HomePage.css'

const HomePage = () => (
  <div>
    <Navbar />
    <header className="hero-section">
      <h1>Welcome to Our Online Store</h1>
      <p>Discover our collection of amazing products.</p>
      <button>Shop Now</button>
    </header>
    <section className="products-section">
      <h2>Featured Products</h2>
      <div className="products-grid">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </section>
  </div>
)

export default HomePage
