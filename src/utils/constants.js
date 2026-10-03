export const CATEGORIES = [
  { name: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80" },
  { name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80" },
  { name: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80" },
  { name: "Bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80" },
  { name: "Bangles", image: "https://images.unsplash.com/photo-1588444968477-fae99e4ceb78?w=500&q=80" },
  { name: "Pendants", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&q=80" },
  { name: "Bridal Jewelry", image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80" },
  { name: "Men's Jewelry", image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=500&q=80" },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const MATERIALS = ["Gold", "Silver", "Diamond", "Platinum"];

export const ORDER_STATUSES = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

export const FREE_SHIPPING_THRESHOLD = 5000;
export const FLAT_SHIPPING_FEE = 99;
