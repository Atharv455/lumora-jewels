import { NavLink } from "react-router-dom";
import "./AdminLayout.css";

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

function AdminLayout({ title, children }) {
  return (
    <div className="admin-layout">
      <div className="container admin-layout__inner">
        <aside className="admin-nav">
          <h2>Admin Panel</h2>
          <nav>
            {ADMIN_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin"}
                className={({ isActive }) => (isActive ? "admin-nav__link admin-nav__link--active" : "admin-nav__link")}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="admin-content">
          <h1>{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
