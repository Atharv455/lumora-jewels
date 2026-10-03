import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getAllProducts } from "../services/productService";
import { CATEGORY_NAMES } from "../utils/constants";
import "./Shop.css";

const INITIAL_FILTERS = { search: "", category: "", minPrice: "", maxPrice: "", sort: "featured" };

function Shop() {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [filters, setFilters] = useState(() => ({
    ...INITIAL_FILTERS,
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
  }));

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

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS);
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search.trim()) {
      const term = filters.search.trim().toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term) ||
          product.material?.toLowerCase().includes(term)
      );
    }

    if (filters.category) {
      result = result.filter((product) => product.category === filters.category);
    }

    if (filters.minPrice) {
      result = result.filter((product) => product.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter((product) => product.price <= Number(filters.maxPrice));
    }

    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, filters]);

  const hasActiveFilters =
    filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.sort !== "featured";

  return (
    <div className="shop-page">
      <div className="page-head">
        <span className="eyebrow">Our Collection</span>
        <h1>Shop All Jewelry</h1>
        <p>Browse handcrafted pieces across rings, necklaces, earrings and more.</p>
      </div>

      <div className="container section">
        <div className="shop-filters">
          <input
            type="search"
            name="search"
            placeholder="Search by name, category or material..."
            value={filters.search}
            onChange={handleFilterChange}
            aria-label="Search jewelry"
            className="shop-filters__search"
          />

          <select name="category" value={filters.category} onChange={handleFilterChange} aria-label="Filter by category">
            <option value="">All Categories</option>
            {CATEGORY_NAMES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <input
            type="number"
            name="minPrice"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={handleFilterChange}
            aria-label="Minimum price"
            min="0"
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            aria-label="Maximum price"
            min="0"
          />

          <select name="sort" value={filters.sort} onChange={handleFilterChange} aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="rating">Rating</option>
          </select>

          {hasActiveFilters && (
            <button type="button" className="btn btn-outline shop-filters__clear" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>

        {loading && <Loader label="Loading products..." />}

        {!loading && loadError && (
          <p className="form-error-banner" role="alert">{loadError}</p>
        )}

        {!loading && !loadError && filteredProducts.length === 0 && (
          <EmptyState title="No products found." message="Try adjusting your search or filters." />
        )}

        {!loading && !loadError && filteredProducts.length > 0 && (
          <>
            <p className="shop-results-count">{filteredProducts.length} products</p>
            <ProductGrid products={filteredProducts} />
          </>
        )}
      </div>
    </div>
  );
}

export default Shop;
