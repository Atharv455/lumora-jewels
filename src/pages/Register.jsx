import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isRequired, isValidEmail, hasMinLength } from "../utils/validation";
import { getAuthErrorMessage } from "../utils/firebaseErrors";
import "./Auth.css";

const INITIAL_FORM = { name: "", email: "", password: "", confirmPassword: "" };
const MIN_PASSWORD_LENGTH = 6;

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!isRequired(form.name)) nextErrors.name = "Full name is required.";

    if (!isRequired(form.email)) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!isRequired(form.password)) {
      nextErrors.password = "Password is required.";
    } else if (!hasMinLength(form.password, MIN_PASSWORD_LENGTH)) {
      nextErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (!isRequired(form.confirmPassword)) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Your Account</h1>
        <p className="auth-card__subtitle">Join LUMORA JEWELS to track orders and save your wishlist.</p>

        {formError && <p className="form-error-banner" role="alert">{formError}</p>}

        <form onSubmit={handleSubmit} noValidate>
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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
