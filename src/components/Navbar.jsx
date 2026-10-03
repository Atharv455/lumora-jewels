import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    navigate(trimmed ? `/shop?search=${encodeURIComponent(trimmed)}` : "/shop");
    setSearchTerm("");
    setSearchOpen(false);
    closeMenu();
  }

  async function handleLogout() {
    await logout();
    closeMenu();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          LUMORA <span>JEWELS</span>
        </Link>

        <nav className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "navbar__link navbar__link--active" : "navbar__link")}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="navbar__auth-mobile">
            {currentUser ? (
              <>
                <Link to="/orders" onClick={closeMenu} className="navbar__link">
                  My Orders
                </Link>
                <Link to="/profile" onClick={closeMenu} className="navbar__link">
                  {userProfile?.name || "My Profile"}
                </Link>
                {userProfile?.role === "admin" && (
                  <Link to="/admin" onClick={closeMenu} className="navbar__link">
                    Admin Panel
                  </Link>
                )}
                <button type="button" className="btn btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="navbar__link">
                  Login
                </Link>
                <Link to="/register" onClick={closeMenu} className="btn btn-gold">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="navbar__actions">
          <form
            className={`navbar__search ${searchOpen ? "navbar__search--open" : ""}`}
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <input
              type="search"
              placeholder="Search jewelry..."
              aria-label="Search jewelry"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <button
            type="button"
            className="navbar__icon-btn"
            aria-label="Toggle search"
            onClick={() => setSearchOpen((open) => !open)}
          >
            <FiSearch size={20} />
          </button>

          <Link to="/wishlist" className="navbar__icon-btn navbar__wishlist" aria-label="Wishlist">
            <FiHeart size={20} />
            {wishlistCount > 0 && <span className="navbar__badge">{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className="navbar__icon-btn navbar__cart" aria-label="Cart">
            <FiShoppingBag size={20} />
            {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
          </Link>

          <Link
            to={currentUser ? "/profile" : "/login"}
            className="navbar__icon-btn navbar__account"
            aria-label={currentUser ? "My profile" : "Login"}
          >
            <FiUser size={20} />
          </Link>

          {currentUser && (
            <button
              type="button"
              className="navbar__icon-btn navbar__logout"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <FiLogOut size={20} />
            </button>
          )}

          <button
            type="button"
            className="navbar__icon-btn navbar__burger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
