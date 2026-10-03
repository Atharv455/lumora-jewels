import { FiAward, FiFeather, FiHeart, FiTool } from "react-icons/fi";
import "./About.css";

const VALUES = [
  { icon: FiAward, title: "Uncompromising Quality", text: "Every gemstone and metal is sourced and certified to the highest standards." },
  { icon: FiHeart, title: "Customer First", text: "We design for real moments — engagements, weddings, and everyday joy." },
  { icon: FiFeather, title: "Timeless Design", text: "Our pieces are made to transcend trends and be cherished for generations." },
  { icon: FiTool, title: "Master Craftsmanship", text: "Each piece passes through the hands of skilled artisans before it reaches you." },
];

function About() {
  return (
    <div className="about-page">
      <div className="page-head">
        <span className="eyebrow">Our Story</span>
        <h1>About LUMORA JEWELS</h1>
        <p>Timeless elegance, crafted with purpose.</p>
      </div>

      <section className="section">
        <div className="container about-story">
          <div className="about-story__text">
            <h2>Our Brand Story</h2>
            <p>
              LUMORA JEWELS was founded with a simple belief: fine jewelry should feel personal,
              not just precious. What began as a small atelier of passionate artisans has grown
              into a destination for customers seeking jewelry that marks life's most meaningful
              moments — without compromising on craftsmanship or authenticity.
            </p>
            <p>
              Every collection we create blends traditional goldsmithing techniques with
              contemporary design, resulting in pieces that feel both classic and distinctly
              modern.
            </p>
          </div>
          <img
            className="about-story__image"
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=80"
            alt="Artisan crafting a gold jewelry piece"
          />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">What Drives Us</span>
            <h2>Our Mission &amp; Values</h2>
            <p>
              Our mission is to make exceptional, ethically-sourced jewelry accessible —
              paired with an experience as elegant as the pieces themselves.
            </p>
          </div>
          <div className="values-grid">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div className="value-card" key={title}>
                <Icon size={26} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container quality-strip">
          <div>
            <h2>Our Quality Promise</h2>
            <p>
              Every LUMORA JEWELS piece is hallmark-certified for metal purity, and every
              diamond and gemstone is graded and certified before it leaves our workshop.
              We stand behind the authenticity of everything we sell.
            </p>
          </div>
          <div>
            <h2>Craftsmanship</h2>
            <p>
              Our artisans bring decades of combined experience in traditional jewelry making.
              From hand-setting stones to polishing the final finish, every piece undergoes
              rigorous quality checks before reaching our customers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
