import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { isRequired, isValidEmail } from "../utils/validation";
import "./Contact.css";

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!isRequired(form.name)) nextErrors.name = "Name is required.";
    if (!isRequired(form.email)) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!isRequired(form.subject)) nextErrors.subject = "Subject is required.";
    if (!isRequired(form.message)) nextErrors.message = "Message cannot be empty.";
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setForm(INITIAL_FORM);
    }
  }

  return (
    <div className="contact-page">
      <div className="page-head">
        <span className="eyebrow">We'd Love To Hear From You</span>
        <h1>Contact Us</h1>
        <p>Have a question about an order or a custom piece? Reach out below.</p>
      </div>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <div className="contact-info__item">
              <FiMapPin size={20} />
              <div>
                <h3>Address</h3>
                <p>123 Jewel Street, Pune, Maharashtra 411001</p>
              </div>
            </div>
            <div className="contact-info__item">
              <FiPhone size={20} />
              <div>
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="contact-info__item">
              <FiMail size={20} />
              <div>
                <h3>Email</h3>
                <p>support@lumorajewels.com</p>
              </div>
            </div>
            <div className="contact-info__item">
              <FiClock size={20} />
              <div>
                <h3>Business Hours</h3>
                <p>Mon – Sat: 10:00 AM – 8:00 PM</p>
              </div>
            </div>
            <p className="contact-info__faq">
              Looking for quick answers? Visit our <Link to="/about">FAQ section</Link>.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {submitted && (
              <p className="form-success" role="status">
                Thank you! Your message has been received. We'll get back to you soon.
              </p>
            )}

            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                aria-invalid={Boolean(errors.subject)}
              />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
