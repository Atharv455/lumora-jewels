import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import { useToast } from "../../context/ToastContext";
import { ORDER_STATUSES } from "../../utils/constants";
import { formatPrice, formatDate } from "../../utils/helpers";
import "./Admin.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const showToast = useToast();

  useEffect(() => {
    let isMounted = true;
    getAllOrders()
      .then((data) => {
        if (isMounted) setOrders(data);
      })
      .catch(() => {
        if (isMounted) setLoadError("Could not load orders right now.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleStatusChange(order, newStatus) {
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, orderStatus: newStatus } : o)));
      showToast(`Order #${order.id.slice(0, 8).toUpperCase()} marked as ${newStatus}.`);
    } catch {
      showToast("Could not update order status. Please try again.", "error");
    }
  }

  return (
    <AdminLayout title="Manage Orders">
      {loading && <Loader label="Loading orders..." />}

      {!loading && loadError && <p className="form-error-banner" role="alert">{loadError}</p>}

      {!loading && !loadError && orders.length === 0 && (
        <p className="admin-empty-text">No orders have been placed yet.</p>
      )}

      {!loading && !loadError && orders.length > 0 && (
        <div className="admin-table">
          <div className="admin-table__row admin-table__row--head">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {orders.map((order) => (
            <div className="admin-table__row" key={order.id}>
              <span>#{order.id.slice(0, 8).toUpperCase()}</span>
              <span>{order.customer?.name}<br /><small>{order.customer?.phone}</small></span>
              <span>{formatDate(order.createdAt)}</span>
              <span>{formatPrice(order.total)}</span>
              <select
                value={order.orderStatus}
                onChange={(event) => handleStatusChange(order, event.target.value)}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default Orders;
