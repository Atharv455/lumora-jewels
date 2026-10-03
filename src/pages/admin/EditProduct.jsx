import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ProductForm from "../../components/ProductForm";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { getProductById, updateProduct } from "../../services/productService";
import { useToast } from "../../context/ToastContext";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getProductById(id)
      .then((data) => {
        if (isMounted) setProduct(data);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleSubmit(productData) {
    await updateProduct(id, productData);
    showToast(`${productData.name} updated.`);
    navigate("/admin/products");
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <Loader label="Loading product..." />
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout title="Edit Product">
        <EmptyState title="Product not found." actionLabel="Back to Products" actionTo="/admin/products" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <ProductForm
        initialValues={{
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          category: product.category,
          material: product.material,
          gender: product.gender,
          stock: product.stock,
          image: product.images?.[0] || "",
          rating: product.rating,
          reviewCount: product.reviewCount,
          featured: product.featured,
          bestseller: product.bestseller,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </AdminLayout>
  );
}

export default EditProduct;
