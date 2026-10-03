import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createOrder } from "../services/orderService";
import { isRequired, isValidPhone, isValidPincode } from "../utils/validation";
import { formatPrice } from "../utils/helpers";
import "./Checkout.css";

const INITIAL_FORM = { name: "", phone: "", address: "", city: "", state: "", pincode: "" };

function Checkout() {
  const { items, subtotal, discount, shipping, total, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...INITIAL_FORM, name: userProfile?.name || "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="page-head">
          <span className="eyebrow">Checkout</span>
          <h1>Checkout</h1>
        </div>
        <EmptyState
          title="Your cart is empty."
          message="Add some jewelry to your cart before checking out."
          actionLabel="Continue Shopping"
          actionTo="/shop"
        />
      </div>
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!isRequired(form.name)) nextErrors.name = "Full name is required.";
    if (!isRequired(form.phone)) {
      nextErrors.phone = "Phone number is required.";
    } else if (!isValidPhone(form.phone)) {
      nextErrors.phone = "Enter a valid 10-digit phone number.";
    }
    if (!isRequired(form.address)) nextErrors.address = "Address is required.";
    if (!isRequired(form.city)) nextErrors.city = "City is required.";
    if (!isRequired(form.state)) nextErrors.state = "State is required.";
    if (!isRequired(form.pincode)) {
      nextErrors.pincode = "Pincode is required.";
    } else if (!isValidPincode(form.pincode)) {
      nextErrors.pincode = "Enter a valid 6-digit pincode.";
    }
    return nextErrors;
  }

  async function handlePlaceOrder(event) {
    event.preventDefault();
    setFormError("");

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPlacing(true);
    try {
      const orderId = await createOrder({
        userId: currentUser.uid,
        customer: {
          name: form.name,
          email: currentUser.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        discount,
        shipping,
        total,
      });

      clearCart();
      showToast("Order placed successfully!");
      navigate(`/orders/${orderId}`, { replace: true });
    } catch {
      setFormError("Could not place your order right now. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="checkout-page">
      <div className="page-head">
        <span className="eyebrow">Checkout</span>
        <h1>Checkout</h1>
      </div>

      <div className="container section checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder} noValidate>
          {formError && <p className="form-error-banner" role="alert">{formError}</p>}

          <h3>Shipping Information</h3>

          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} aria-invalid={Boolean(errors.phone)} />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="address">Address</label>
            <textarea id="address" name="address" rows={3} value={form.address} onChange={handleChange} aria-invalid={Boolean(errors.address)} />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          <div className="checkout-form__row">
            <div className="form-field">
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} aria-invalid={Boolean(errors.city)} />
              {errors.city && <span className="form-error">{errors.city}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="state">State</label>
              <input id="state" name="state" value={form.state} onChange={handleChange} aria-invalid={Boolean(errors.state)} />
              {errors.state && <span className="form-error">{errors.state}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="pincode">Pincode</label>
              <input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} aria-invalid={Boolean(errors.pincode)} />
              {errors.pincode && <span className="form-error">{errors.pincode}</span>}
            </div>
          </div>

          <div className="checkout-form__payment">
            <h3>Payment Method</h3>
            <label className="checkout-form__payment-option">
              <input type="radio" name="paymentMethod" checked readOnly />
              Cash on Delivery (Demo Order — no real payment is processed)
            </label>
          </div>

          <ul className="checkout-items-preview">
            {items.map((item) => (
              <li key={item.id}>
                <span>{item.name} &times; {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <button type="submit" className="btn btn-primary btn-block" disabled={placing}>
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <OrderSummary subtotal={subtotal} discount={discount} shipping={shipping} total={total} />
      </div>
    </div>
  );
}

export default Checkout;
