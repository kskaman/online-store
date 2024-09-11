import PropTypes from 'prop-types'
import '../styles/ProductCard.css'

const ProductCard = ({product, currency}) => (
  <div className="product-card">
    <img src={product.imageUrl} alt={product.description} />
    <h3>{product.name}</h3>
    <p>{currency} {product.price}</p>
    <button>Add to Cart</button>
  </div>
)


// Add PropTypes validation
ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
  currency: PropTypes.string.isRequired,
}

export default ProductCard