import { createContext, useContext, useEffect, useState } from "react";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_FEE } from "../utils/constants";

const CartContext = createContext(null);
const STORAGE_KEY = "lumora_cart";

function readCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCartFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private browsing, quota exceeded) - cart stays in-memory only.
    }
  }, [items]);

  function addToCart(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const maxQty = product.stock ?? Infinity;
        const nextQty = Math.min(existing.quantity + quantity, maxQty);
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: nextQty } : item));
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || product.image,
          category: product.category,
          stock: product.stock,
          quantity: Math.max(1, Math.min(quantity, product.stock ?? quantity)),
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function increaseQuantity(productId) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.stock ?? item.quantity + 1) }
          : item
      )
    );
  }

  function decreaseQuantity(productId) {
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const total = subtotal + shipping;

  const value = {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
