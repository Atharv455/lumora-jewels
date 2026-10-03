import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import EmptyState from "../components/EmptyState";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/helpers";
import "./Wishlist.css";

function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const showToast = useToast();

  function handleMoveToCart(item) {
    addToCart(item);
    removeFromWishlist(item.id);
    showToast(`${item.name} moved to cart.`);
  }

  function handleRemove(item) {
    removeFromWishlist(item.id);
    showToast(`${item.name} removed from wishlist.`);
  }

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="page-head">
          <span className="eyebrow">Saved For Later</span>
          <h1>My Wishlist</h1>
        </div>
        <EmptyState
          title="Your wishlist is empty."
          message="Save pieces you love and come back to them anytime."
          actionLabel="Browse Jewelry"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="page-head">
        <span className="eyebrow">Saved For Later</span>
        <h1>My Wishlist</h1>
        <p>{items.length} item{items.length > 1 ? "s" : ""} saved</p>
      </div>

      <div className="container section wishlist-grid">
        {items.map((item) => (
          <div className="wishlist-card" key={item.id}>
            <Link to={`/product/${item.id}`}>
              <img src={item.image} alt={item.name} />
            </Link>
            <div className="wishlist-card__body">
              <span className="wishlist-card__category">{item.category}</span>
              <Link to={`/product/${item.id}`}><h3>{item.name}</h3></Link>
              <span className="wishlist-card__price">{formatPrice(item.price)}</span>
              <div className="wishlist-card__actions">
                <button type="button" className="btn btn-primary" onClick={() => handleMoveToCart(item)}>
                  Move to Cart
                </button>
                <button
                  type="button"
                  className="wishlist-card__remove"
                  onClick={() => handleRemove(item)}
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
