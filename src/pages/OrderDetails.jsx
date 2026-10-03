import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { getOrderById } from "../services/orderService";
import { formatPrice, formatDate } from "../utils/helpers";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const { currentUser, isAdmin } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getOrderById(id)
      .then((data) => {
        if (!isMounted) return;
        if (data && (isAdmin || data.userId === currentUser.uid)) {
          setOrder(data);
        } else {
          setOrder(null);
        }
      })
      .catch(() => {
        if (isMounted) setLoadError("Could not load this order right now. Please try again later.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id, currentUser.uid, isAdmin]);

  if (loading) return <Loader label="Loading order..." />;

  if (loadError) {
    return (
      <div className="container section">
        <p className="form-error-banner" role="alert">{loadError}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found."
        message="This order doesn't exist or you don't have permission to view it."
        actionLabel="View My Orders"
        actionTo="/orders"
      />
    );
  }

  return (
    <div className="order-details-page">
      <div className="page-head">
        <span className="eyebrow">Order #{order.id.slice(0, 8).toUpperCase()}</span>
        <h1>Order Details</h1>
        <p>Placed on {formatDate(order.createdAt)}</p>
      </div>

      <div className="container section order-details-layout">
        <div className="order-details-main">
          <div className="order-details-card">
            <h3>Status</h3>
            <span className={`order-status order-status--${order.orderStatus?.toLowerCase()}`}>
              {order.orderStatus}
            </span>
            <p className="order-details-card__payment">
              Payment: {order.paymentMethod} &middot; {order.paymentStatus}
            </p>
          </div>

          <div className="order-details-card">
            <h3>Items</h3>
            <ul className="order-details-items">
              {order.items?.map((item) => (
                <li key={item.productId}>
                  {item.image && <img src={item.image} alt={item.name} />}
                  <div>
                    <span className="order-details-items__name">{item.name}</span>
                    <span className="order-details-items__qty">Qty: {item.quantity}</span>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-details-card">
            <h3>Shipping Address</h3>
            <p>{order.customer?.name}</p>
            <p>{order.customer?.address}</p>
            <p>{order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}</p>
            <p>Phone: {order.customer?.phone}</p>
          </div>
        </div>

        <div className="order-details-card order-details-summary">
          <h3>Order Summary</h3>
          <div className="order-summary__row">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="order-summary__row order-summary__row--discount">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="order-summary__row">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="order-summary__row order-summary__row--total">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="container">
        <Link to="/orders" className="product-details__back">&larr; Back to Order History</Link>
      </div>
    </div>
  );
}

export default OrderDetails;
