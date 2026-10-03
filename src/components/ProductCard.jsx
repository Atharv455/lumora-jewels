import { Link } from "react-router-dom";
import { FiHeart, FiStar } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { formatPrice, calculateDiscountPercent } from "../utils/helpers";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const showToast = useToast();

  const discount = calculateDiscountPercent(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;

  function handleAddToCart(event) {
    event.preventDefault();
    addToCart(product);
    showToast(`${product.name} added to cart.`);
  }

  function handleToggleWishlist(event) {
    event.preventDefault();
    toggleWishlist(product);
    showToast(wishlisted ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist.`);
  }

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__media">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
        {discount > 0 && <span className="product-card__badge">{discount}% OFF</span>}
        <button
          type="button"
          className={`product-card__wishlist ${wishlisted ? "product-card__wishlist--active" : ""}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={handleToggleWishlist}
        >
          <FiHeart size={17} />
        </button>
      </Link>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>

        <div className="product-card__rating" aria-label={`Rated ${product.rating} out of 5`}>
          <FiStar size={14} />
          <span>{product.rating}</span>
          <span className="product-card__reviews">({product.reviewCount})</span>
        </div>

        <div className="product-card__price">
          <span className="product-card__price-current">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="product-card__price-original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <button type="button" className="btn btn-primary btn-block" onClick={handleAddToCart} disabled={outOfStock}>
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
