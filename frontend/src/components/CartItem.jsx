import PropTypes from 'prop-types'
import '../styles/CartItem.css'

const CartItem = ({ item }) => {
  return (
    <div className="cart-item">
      <img src={item.imageUrl} alt={item.name} />
      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>{item.price} {item.currency}</p>
      </div>
    </div>
  )
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
}

export default CartItem
