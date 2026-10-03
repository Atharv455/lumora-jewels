import { useState } from "react";
import { CATEGORY_NAMES, MATERIALS } from "../utils/constants";
import { isRequired } from "../utils/validation";
import "./ProductForm.css";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: CATEGORY_NAMES[0],
  material: MATERIALS[0],
  gender: "Unisex",
  stock: "",
  image: "",
};

function ProductForm({ initialValues, onSubmit, submitLabel = "Save Product" }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!isRequired(form.name)) nextErrors.name = "Product name is required.";
    if (!isRequired(form.description)) nextErrors.description = "Description is required.";
    if (!form.price || Number(form.price) <= 0) nextErrors.price = "Enter a valid price.";
    if (form.stock === "" || Number(form.stock) < 0) nextErrors.stock = "Enter a valid stock quantity.";
    if (!isRequired(form.image)) nextErrors.image = "Image URL is required.";
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
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : Number(form.price),
        category: form.category,
        material: form.material,
        gender: form.gender,
        stock: Number(form.stock),
        images: [form.image.trim()],
        rating: initialValues?.rating ?? 4.5,
        reviewCount: initialValues?.reviewCount ?? 0,
        featured: initialValues?.featured ?? false,
        bestseller: initialValues?.bestseller ?? false,
      });
    } catch {
      setFormError("Could not save this product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      {formError && <p className="form-error-banner" role="alert">{formError}</p>}

      <div className="form-field">
        <label htmlFor="name">Product Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} aria-invalid={Boolean(errors.description)} />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="product-form__row">
        <div className="form-field">
          <label htmlFor="price">Price (₹)</label>
          <input id="price" name="price" type="number" min="0" value={form.price} onChange={handleChange} aria-invalid={Boolean(errors.price)} />
          {errors.price && <span className="form-error">{errors.price}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="originalPrice">Original Price (₹, optional)</label>
          <input id="originalPrice" name="originalPrice" type="number" min="0" value={form.originalPrice} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="stock">Stock</label>
          <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} aria-invalid={Boolean(errors.stock)} />
          {errors.stock && <span className="form-error">{errors.stock}</span>}
        </div>
      </div>

      <div className="product-form__row">
        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORY_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="material">Material</label>
          <select id="material" name="material" value={form.material} onChange={handleChange}>
            {MATERIALS.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="image">Image URL</label>
        <input id="image" name="image" value={form.image} onChange={handleChange} aria-invalid={Boolean(errors.image)} placeholder="https://..." />
        {errors.image && <span className="form-error">{errors.image}</span>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default ProductForm;
