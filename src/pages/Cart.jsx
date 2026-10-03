import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import EmptyState from "../components/EmptyState";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/helpers";
import "./Cart.css";

function Cart() {
  const { items, subtotal, discount, shipping, total, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const showToast = useToast();

  function handleRemove(item) {
    removeFromCart(item.id);
    showToast(`${item.name} removed from cart.`);
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-head">
          <span className="eyebrow">Your Bag</span>
          <h1>Shopping Cart</h1>
        </div>
        <EmptyState
          title="Your cart is empty."
          message="Looks like you haven't added anything yet."
          actionLabel="Continue Shopping"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-head">
        <span className="eyebrow">Your Bag</span>
        <h1>Shopping Cart</h1>
      </div>

      <div className="container section cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} className="cart-item__image" />
              <div className="cart-item__info">
                <span className="cart-item__category">{item.category}</span>
                <h3>{item.name}</h3>
                <span className="cart-item__price">{formatPrice(item.price)}</span>
              </div>
              <div className="cart-item__qty">
                <button type="button" onClick={() => decreaseQuantity(item.id)} aria-label="Decrease quantity">-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => increaseQuantity(item.id)} aria-label="Increase quantity">+</button>
              </div>
              <div className="cart-item__subtotal">{formatPrice(item.price * item.quantity)}</div>
              <button
                type="button"
                className="cart-item__remove"
                onClick={() => handleRemove(item)}
                aria-label={`Remove ${item.name}`}
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <OrderSummary subtotal={subtotal} discount={discount} shipping={shipping} total={total}>
          <Link to="/checkout" className="btn btn-primary btn-block">Proceed to Checkout</Link>
          <Link to="/shop" className="cart-layout__continue">Continue Shopping</Link>
        </OrderSummary>
      </div>
    </div>
  );
}

export default Cart;
