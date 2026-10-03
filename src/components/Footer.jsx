import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import { CATEGORIES } from "../utils/constants";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col footer__brand">
          <Link to="/" className="footer__logo">
            LUMORA <span>JEWELS</span>
          </Link>
          <p>
            Timeless jewelry, handcrafted with care. Discover rings, necklaces, earrings
            and bridal collections designed to be cherished for a lifetime.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Facebook"><FiFacebook size={18} /></a>
            <a href="#" aria-label="Instagram"><FiInstagram size={18} /></a>
            <a href="#" aria-label="Twitter"><FiTwitter size={18} /></a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Categories</h4>
          <ul>
            {CATEGORIES.slice(0, 5).map((category) => (
              <li key={category.name}>
                <Link to="/shop">{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Get In Touch</h4>
          <ul className="footer__contact">
            <li>123 Jewel Street, Pune, Maharashtra 411001</li>
            <li>+91 98765 43210</li>
            <li>support@lumorajewels.com</li>
            <li>Mon – Sat: 10:00 AM – 8:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {year} LUMORA JEWELS. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
