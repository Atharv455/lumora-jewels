import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShield, FiTruck, FiLock, FiRefreshCw, FiStar } from "react-icons/fi";
import ProductGrid from "../components/ProductGrid";
import Loader from "../components/Loader";
import { getAllProducts } from "../services/productService";
import { CATEGORIES } from "../utils/constants";
import { isValidEmail } from "../utils/validation";
import "./Home.css";

const WHY_CHOOSE_US = [
  { icon: FiShield, title: "Certified Quality", text: "Every piece is hallmark certified for purity and authenticity." },
  { icon: FiTruck, title: "Free Shipping", text: "Complimentary insured shipping on all orders above ₹5,000." },
  { icon: FiLock, title: "Secure Payments", text: "Your transactions are protected with industry-standard security." },
  { icon: FiRefreshCw, title: "Easy Returns", text: "Hassle-free 7-day returns and exchanges on every order." },
];

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    quote: "The craftsmanship on my engagement ring is stunning. LUMORA JEWELS exceeded every expectation.",
  },
  {
    name: "Rohan Mehta",
    quote: "Bought a bracelet for my wife's anniversary — the quality and packaging felt truly premium.",
  },
  {
    name: "Priya Nair",
    quote: "My bridal set was exactly as pictured. Comfortable, elegant, and worth every rupee.",
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getAllProducts()
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch(() => {
        if (isMounted) setLoadError("Could not load products right now. Please try again later.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  const newArrivals = [...products]
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    .slice(0, 4);
  const bestsellers = products.filter((product) => product.bestseller).slice(0, 4);

  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  function handleNewsletterSubmit(event) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setNewsletterMessage("Please enter a valid email address.");
      return;
    }
    setNewsletterMessage("Thank you for subscribing to LUMORA JEWELS!");
    setEmail("");
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="eyebrow">LUMORA JEWELS</span>
            <h1>Timeless Elegance, Crafted for You</h1>
            <p>
              Discover handcrafted fine jewelry designed to celebrate every milestone —
              from everyday radiance to once-in-a-lifetime moments.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn-gold">Shop Now</Link>
              <Link to="/shop" className="btn btn-outline">Explore Collection</Link>
            </div>
          </div>
        </div>
      </section>

      {loading && <Loader label="Loading collection..." />}

      {!loading && loadError && (
        <div className="container section">
          <p className="form-error-banner" role="alert">{loadError}</p>
        </div>
      )}

      {!loading && !loadError && featuredProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Handpicked For You</span>
              <h2>Featured Jewelry</h2>
              <p>A curated selection of our most loved pieces this season.</p>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      <section className="section section--alt" id="categories">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Browse</span>
            <h2>Shop by Category</h2>
            <p>Find the perfect piece from our complete jewelry collection.</p>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((category) => (
              <Link to={`/shop?category=${encodeURIComponent(category.name)}`} key={category.name} className="category-card">
                <img src={category.image} alt={category.name} loading="lazy" />
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!loading && !loadError && newArrivals.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Just In</span>
              <h2>New Arrivals</h2>
              <p>Fresh designs, newly added to our collection.</p>
            </div>
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      <section className="promo">
        <div className="container promo__inner">
          <h2>Bridal Collection 2026</h2>
          <p>Exquisite sets designed for your most memorable day. Use code BRIDAL10 for 10% off.</p>
          <Link to="/shop" className="btn btn-primary">Explore Bridal Jewelry</Link>
        </div>
      </section>

      {!loading && !loadError && bestsellers.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Most Loved</span>
              <h2>Best Sellers</h2>
              <p>The pieces our customers can't stop talking about.</p>
            </div>
            <ProductGrid products={bestsellers} />
          </div>
        </section>
      )}

      <section className="section why-us">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Our Promise</span>
            <h2>Why Choose Us</h2>
          </div>
          <div className="why-us__grid">
            {WHY_CHOOSE_US.map(({ icon: Icon, title, text }) => (
              <div className="why-us__card" key={title}>
                <Icon size={28} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt testimonials">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Customer Love</span>
            <h2>What Our Customers Say</h2>
          </div>
          <div className="testimonials__grid">
            {TESTIMONIALS.map((testimonial) => (
              <div className="testimonial-card" key={testimonial.name}>
                <div className="testimonial-card__stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FiStar key={index} size={14} />
                  ))}
                </div>
                <p>&ldquo;{testimonial.quote}&rdquo;</p>
                <span>{testimonial.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container newsletter__inner">
          <div>
            <h2>Join the LUMORA Circle</h2>
            <p>Subscribe for early access to new collections and exclusive offers.</p>
          </div>
          <form className="newsletter__form" onSubmit={handleNewsletterSubmit}>
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-gold">Subscribe</button>
          </form>
          {newsletterMessage && <p className="newsletter__message">{newsletterMessage}</p>}
        </div>
      </section>
    </div>
  );
}

export default Home;
