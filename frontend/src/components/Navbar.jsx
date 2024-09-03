import '../styles/Navbar.css'

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-brand">Online Store</div>
    <ul className="navbar-links">
      <li><a href="/">Home</a></li>
      <li><a href="/products">Products</a></li>
      <li><a href="/cart">Cart</a></li>
      <li><a href="login">Login/Register</a></li>
    </ul>
  </nav>
)

export default Navbar