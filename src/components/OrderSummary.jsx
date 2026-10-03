import { formatPrice } from "../utils/helpers";
import "./OrderSummary.css";

function OrderSummary({ subtotal, discount, shipping, total, children }) {
  return (
    <aside className="order-summary">
      <h3>Order Summary</h3>
      <div className="order-summary__row">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="order-summary__row order-summary__row--discount">
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}
      <div className="order-summary__row">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
      </div>
      <div className="order-summary__row order-summary__row--total">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      {children}
    </aside>
  );
}

export default OrderSummary;
