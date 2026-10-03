import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { getOrdersByUser } from "../services/orderService";
import { formatPrice, formatDate } from "../utils/helpers";
import "./Orders.css";

function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getOrdersByUser(currentUser.uid)
      .then((data) => {
        if (isMounted) setOrders(data);
      })
      .catch(() => {
        if (isMounted) setLoadError("Could not load your orders right now. Please try again later.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [currentUser.uid]);

  return (
    <div className="orders-page">
      <div className="page-head">
        <span className="eyebrow">Your Orders</span>
        <h1>Order History</h1>
      </div>

      <div className="container section">
        {loading && <Loader label="Loading orders..." />}

        {!loading && loadError && <p className="form-error-banner" role="alert">{loadError}</p>}

        {!loading && !loadError && orders.length === 0 && (
          <EmptyState
            title="You haven't placed any orders yet."
            message="Start shopping to see your orders here."
            actionLabel="Browse Jewelry"
            actionTo="/shop"
          />
        )}

        {!loading && !loadError && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <Link to={`/orders/${order.id}`} key={order.id} className="order-row">
                <div>
                  <span className="order-row__id">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className="order-row__date">{formatDate(order.createdAt)}</span>
                </div>
                <span>{order.items?.length || 0} item{order.items?.length === 1 ? "" : "s"}</span>
                <span>{formatPrice(order.total)}</span>
                <span className={`order-status order-status--${order.orderStatus?.toLowerCase()}`}>
                  {order.orderStatus}
                </span>
                <span className="order-row__payment">{order.paymentStatus}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
