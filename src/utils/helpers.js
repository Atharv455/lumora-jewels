export function formatPrice(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export function calculateDiscountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function formatDate(timestamp) {
  if (!timestamp) return "—";
  const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}
