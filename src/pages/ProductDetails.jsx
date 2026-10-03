import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { formatPrice, calculateDiscountPercent } from "../utils/helpers";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const showToast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError("");
    getProductById(id)
      .then((data) => {
        if (isMounted) setProduct(data);
      })
      .catch(() => {
        if (isMounted) setLoadError("Could not load this product right now. Please try again later.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <Loader label="Loading product..." />;

  if (loadError) {
    return (
      <div className="container section">
        <p className="form-error-banner" role="alert">{loadError}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found."
        message="The product you're looking for doesn't exist or may have been removed."
        actionLabel="Back to Shop"
        actionTo="/shop"
      />
    );
  }

  const discount = calculateDiscountPercent(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;

  function handleQuantityChange(delta) {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product.stock || 1)));
  }

  function handleAddToCart() {
    addToCart(product, quantity);
    showToast(`${product.name} added to cart.`);
  }

  function handleBuyNow() {
    addToCart(product, quantity);
    navigate("/cart");
  }

  function handleToggleWishlist() {
    toggleWishlist(product);
    showToast(wishlisted ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist.`);
  }

  return (
    <div className="product-details container section">
      <div className="product-details__grid">
        <div className="product-details__gallery">
          <img src={product.images?.[0]} alt={product.name} />
        </div>

        <div className="product-details__info">
          <span className="product-card__category">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="product-card__rating" aria-label={`Rated ${product.rating} out of 5`}>
            <FiStar size={15} />
            <span>{product.rating}</span>
            <span className="product-card__reviews">({product.reviewCount} reviews)</span>
          </div>

          <div className="product-details__price">
            <span className="product-card__price-current">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="product-card__price-original">{formatPrice(product.originalPrice)}</span>
                <span className="product-card__badge">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="product-details__description">{product.description}</p>

          <ul className="product-details__specs">
            <li><strong>Material:</strong> {product.material}</li>
            {product.weight && <li><strong>Weight:</strong> {product.weight}</li>}
            <li><strong>Category:</strong> {product.category}</li>
            <li>
              <strong>Availability:</strong>{" "}
              {outOfStock ? "Out of stock" : `${product.stock} in stock`}
            </li>
          </ul>

          {!outOfStock && (
            <div className="product-details__quantity">
              <span>Quantity</span>
              <div className="quantity-control">
                <button type="button" onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">+</button>
              </div>
            </div>
          )}

          <div className="product-details__actions">
            <button type="button" className="btn btn-primary" onClick={handleAddToCart} disabled={outOfStock}>
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
            <button type="button" className="btn btn-gold" onClick={handleBuyNow} disabled={outOfStock}>
              Buy Now
            </button>
            <button
              type="button"
              className={`btn btn-outline ${wishlisted ? "product-details__wishlist--active" : ""}`}
              onClick={handleToggleWishlist}
            >
              {wishlisted ? "Wishlisted" : "Add to Wishlist"}
            </button>
          </div>

          <Link to="/shop" className="product-details__back">&larr; Back to Shop</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
