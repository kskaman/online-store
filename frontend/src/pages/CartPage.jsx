import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'
import '../styles/CartPage.css'
import cartService from '../services/cart'

const CartPage = ({ user }) => {
  const [cartItems, setCartItems] = useState([])
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await cartService.getCartItems()
        setCartItems(items.items)  // Assuming "items" contains cart items
      } catch (error) {
        console.error('Error fetching cart items:', error)
      }
    }
    fetchCartItems()
  }, [])

  const handleGuestCheckout = () => {
    setIsGuest(true)
  }

  const handleLoggedInCheckout = () => {
    if (user && user.address) {
      alert(`Proceeding with stored address: ${user.address}`)
    } else {
      alert('Please provide your address')
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.deleteCartItem(itemId)
      setCartItems(cartItems.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleClearCart = async () => {
    try {
      await cartService.clearCart()
      setCartItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartItem key={item.id} item={item} onRemove={() => handleRemoveItem(item.id)} />
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
      <div className="checkout-options">
        <button onClick={handleClearCart}>Clear Cart</button>
        {!user && (
          <div>
            <p>Proceed as guest:</p>
            <button onClick={handleGuestCheckout}>Guest Checkout</button>
          </div>
        )}
        {user && (
          <div>
            <p>Proceed as logged in:</p>
            <button onClick={handleLoggedInCheckout}>Checkout with Stored Info</button>
            {!user.address && <Link to="/add-address">Add Address</Link>}
          </div>
        )}
        {isGuest && (
          <div className="guest-form">
            <h3>Guest Checkout Information</h3>
            <form>
              <label htmlFor="guestName">Name</label>
              <input type="text" id="guestName" name="guestName" required />
              <label htmlFor="guestEmail">Email</label>
              <input type="email" id="guestEmail" name="guestEmail" required />
              <label htmlFor="guestPhone">Phone</label>
              <input type="tel" id="guestPhone" name="guestPhone" required />
              <label htmlFor="guestAddress">Address</label>
              <input type="text" id="guestAddress" name="guestAddress" required />
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

CartPage.propTypes = {
  user: PropTypes.shape({
    address: PropTypes.string
  }),
}

export default CartPage
