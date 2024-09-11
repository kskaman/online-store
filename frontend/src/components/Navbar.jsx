import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-brand">Online Store</div>
    <ul className="navbar-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/products">Products</Link></li>
      <li><Link to="/cart">Cart</Link></li>
      <li><Link to="/login">Login/Register</Link></li>
    </ul>
  </nav>
)

export default Navbar