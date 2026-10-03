import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isRequired, isValidEmail } from "../utils/validation";
import { getAuthErrorMessage } from "../utils/firebaseErrors";
import "./Auth.css";

const INITIAL_FORM = { email: "", password: "" };

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    if (!isRequired(form.email)) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!isRequired(form.password)) nextErrors.password = "Password is required.";
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
      const profile = await login(form);
      const redirectTo = location.state?.from?.pathname;
      if (profile?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(redirectTo || "/", { replace: true });
      }
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-card__subtitle">Login to continue shopping with LUMORA JEWELS.</p>

        {formError && <p className="form-error-banner" role="alert">{formError}</p>}

        <form onSubmit={handleSubmit} noValidate>
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

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
