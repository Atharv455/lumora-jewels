import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ProductForm from "../../components/ProductForm";
import { addProduct } from "../../services/productService";
import { useToast } from "../../context/ToastContext";

function AddProduct() {
  const navigate = useNavigate();
  const showToast = useToast();

  async function handleSubmit(productData) {
    await addProduct(productData);
    showToast(`${productData.name} added.`);
    navigate("/admin/products");
  }

  return (
    <AdminLayout title="Add Product">
      <ProductForm onSubmit={handleSubmit} submitLabel="Add Product" />
    </AdminLayout>
  );
}

export default AddProduct;
