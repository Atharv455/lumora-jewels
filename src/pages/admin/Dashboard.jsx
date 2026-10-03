import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";
import { getAllProducts } from "../../services/productService";
import { getAllOrders } from "../../services/orderService";
import { getAllUsers } from "../../services/userService";
import { formatPrice, formatDate } from "../../utils/helpers";
import "./Admin.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    Promise.all([getAllProducts(), getAllOrders(), getAllUsers()])
      .then(([products, orders, users]) => {
        if (!isMounted) return;
        const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const customers = users.filter((user) => user.role === "customer");
        setStats({
          totalProducts: products.length,
          totalCustomers: customers.length,
          totalOrders: orders.length,
          totalRevenue: revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(() => {
        if (isMounted) setLoadError("Could not load dashboard data right now.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading && <Loader label="Loading dashboard..." />}

      {!loading && loadError && <p className="form-error-banner" role="alert">{loadError}</p>}

      {!loading && !loadError && stats && (
        <>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <span>Total Products</span>
              <strong>{stats.totalProducts}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Total Customers</span>
              <strong>{stats.totalCustomers}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Total Orders</span>
              <strong>{stats.totalOrders}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Total Revenue</span>
              <strong>{formatPrice(stats.totalRevenue)}</strong>
            </div>
          </div>

          <h2 className="admin-section-title">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="admin-empty-text">No orders placed yet.</p>
          ) : (
            <div className="admin-table">
              <div className="admin-table__row admin-table__row--head">
                <span>Order ID</span>
                <span>Customer</span>
                <span>Date</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              {recentOrders.map((order) => (
                <Link to={`/admin/orders`} key={order.id} className="admin-table__row">
                  <span>#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span>{order.customer?.name}</span>
                  <span>{formatDate(order.createdAt)}</span>
                  <span>{formatPrice(order.total)}</span>
                  <span className={`order-status order-status--${order.orderStatus?.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default Dashboard;
