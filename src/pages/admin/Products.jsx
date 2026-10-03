import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";
import { getAllProducts, deleteProduct } from "../../services/productService";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/helpers";
import "./Admin.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const showToast = useToast();

  function loadProducts() {
    setLoading(true);
    getAllProducts()
      .then(setProducts)
      .catch(() => setLoadError("Could not load products right now."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(product) {
    const confirmed = window.confirm(`Delete "${product.name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showToast(`${product.name} deleted.`);
    } catch {
      showToast("Could not delete product. Please try again.", "error");
    }
  }

  return (
    <AdminLayout title="Manage Products">
      <div className="admin-toolbar">
        <Link to="/admin/products/add" className="btn btn-primary">Add Product</Link>
      </div>

      {loading && <Loader label="Loading products..." />}

      {!loading && loadError && <p className="form-error-banner" role="alert">{loadError}</p>}

      {!loading && !loadError && products.length === 0 && (
        <p className="admin-empty-text">No products yet. Add your first product to get started.</p>
      )}

      {!loading && !loadError && products.length > 0 && (
        <div className="admin-table">
          <div className="admin-table__row admin-table__row--head">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Actions</span>
          </div>
          {products.map((product) => (
            <div className="admin-table__row" key={product.id}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={product.images?.[0]} alt={product.name} className="admin-product-thumb" />
                {product.name}
              </span>
              <span>{product.category}</span>
              <span>{formatPrice(product.price)}</span>
              <span>{product.stock}</span>
              <span className="admin-table__actions">
                <Link to={`/admin/products/edit/${product.id}`}>Edit</Link>
                <button type="button" onClick={() => handleDelete(product)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default Products;
