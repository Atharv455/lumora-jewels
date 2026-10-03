import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "lumora_wishlist";

function readWishlistFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readWishlistFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable - wishlist stays in-memory only for this session.
    }
  }, [items]);

  function isWishlisted(productId) {
    return items.some((item) => item.id === productId);
  }

  function addToWishlist(product) {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
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
        },
      ];
    });
  }

  function removeFromWishlist(productId) {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function toggleWishlist(product) {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  const value = {
    items,
    itemCount: items.length,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
