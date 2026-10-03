// One-time Firestore seeding script. Run with:
//   node scripts/seedProducts.mjs <admin-email> <admin-password>
// Requires an existing user whose Firestore `users/{uid}` doc has role: "admin",
// because firestore.rules only allows admins to create product documents.
import { readFileSync } from "fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const envText = readFileSync(new URL("../.env", import.meta.url), "utf-8");
const env = {};
for (const line of envText.split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
}

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});
const auth = getAuth(app);
const db = getFirestore(app);

const products = [
  { name: "Elegant Gold Solitaire Ring", description: "A beautifully handcrafted gold ring featuring a brilliant solitaire centerpiece. Perfect for engagements and special occasions.", price: 24999, originalPrice: 29999, category: "Rings", material: "Gold", gender: "Women", weight: "4.5g", images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80"], rating: 4.7, reviewCount: 32, stock: 15, featured: true, bestseller: false },
  { name: "Classic Silver Band Ring", description: "A minimalist sterling silver band, polished to a brilliant shine for everyday elegance.", price: 3499, originalPrice: 4299, category: "Rings", material: "Silver", gender: "Unisex", weight: "3.2g", images: ["https://images.unsplash.com/photo-1603561596112-0a132b757442?w=600&q=80"], rating: 4.3, reviewCount: 18, stock: 40, featured: false, bestseller: true },
  { name: "Diamond Halo Engagement Ring", description: "A stunning platinum ring with a dazzling diamond halo setting, designed for a lifetime of memories.", price: 89999, originalPrice: 104999, category: "Rings", material: "Diamond", gender: "Women", weight: "5.1g", images: ["https://images.unsplash.com/photo-1587056770832-6a4994b08b01?w=600&q=80"], rating: 4.9, reviewCount: 54, stock: 8, featured: true, bestseller: true },
  { name: "Men's Platinum Signet Ring", description: "A bold platinum signet ring with brushed finish, crafted for the modern gentleman.", price: 42999, originalPrice: 46999, category: "Rings", material: "Platinum", gender: "Men", weight: "6.8g", images: ["https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&q=80"], rating: 4.5, reviewCount: 12, stock: 20, featured: false, bestseller: false },
  { name: "Gold Layered Chain Necklace", description: "A delicate layered chain necklace in 22K gold, designed to add elegance to any outfit.", price: 34999, originalPrice: 39999, category: "Necklaces", material: "Gold", gender: "Women", weight: "8.2g", images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80"], rating: 4.6, reviewCount: 27, stock: 18, featured: true, bestseller: false },
  { name: "Diamond Pendant Necklace", description: "A timeless necklace featuring a brilliant-cut diamond pendant on a fine gold chain.", price: 54999, originalPrice: 62999, category: "Necklaces", material: "Diamond", gender: "Women", weight: "6.4g", images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80"], rating: 4.8, reviewCount: 41, stock: 10, featured: true, bestseller: true },
  { name: "Silver Infinity Necklace", description: "A sleek sterling silver necklace with an infinity pendant, symbolizing everlasting bonds.", price: 2999, originalPrice: 3599, category: "Necklaces", material: "Silver", gender: "Women", weight: "4.1g", images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80"], rating: 4.2, reviewCount: 15, stock: 35, featured: false, bestseller: false },
  { name: "Men's Steel-Gold Chain", description: "A heavyweight statement chain crafted with a gold-steel alloy for everyday durability and style.", price: 12999, originalPrice: 15999, category: "Necklaces", material: "Gold", gender: "Men", weight: "22g", images: ["https://images.unsplash.com/photo-1588444968477-fae99e4ceb78?w=600&q=80"], rating: 4.4, reviewCount: 9, stock: 25, featured: false, bestseller: false },
  { name: "Gold Jhumka Earrings", description: "Traditional gold jhumka earrings with intricate filigree work, perfect for festive occasions.", price: 18999, originalPrice: 21999, category: "Earrings", material: "Gold", gender: "Women", weight: "7.5g", images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"], rating: 4.7, reviewCount: 36, stock: 14, featured: true, bestseller: true },
  { name: "Diamond Stud Earrings", description: "Classic round-cut diamond studs set in white gold, an everyday essential.", price: 27999, originalPrice: 31999, category: "Earrings", material: "Diamond", gender: "Women", weight: "2.8g", images: ["https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80"], rating: 4.9, reviewCount: 48, stock: 22, featured: true, bestseller: false },
  { name: "Silver Drop Earrings", description: "Elegant sterling silver drop earrings with a polished teardrop design.", price: 1999, originalPrice: 2499, category: "Earrings", material: "Silver", gender: "Women", weight: "3.0g", images: ["https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&q=80"], rating: 4.1, reviewCount: 11, stock: 50, featured: false, bestseller: false },
  { name: "Gold Charm Bracelet", description: "A radiant gold bracelet adorned with delicate charms, perfect for layering.", price: 21999, originalPrice: 25999, category: "Bracelets", material: "Gold", gender: "Women", weight: "9.3g", images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80"], rating: 4.6, reviewCount: 23, stock: 17, featured: true, bestseller: false },
  { name: "Men's Leather-Gold Bracelet", description: "A rugged leather bracelet with gold-plated clasp detailing for a refined casual look.", price: 6999, originalPrice: 8499, category: "Bracelets", material: "Gold", gender: "Men", weight: "12g", images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80"], rating: 4.3, reviewCount: 14, stock: 30, featured: false, bestseller: true },
  { name: "Diamond Tennis Bracelet", description: "A dazzling tennis bracelet featuring a continuous line of brilliant-cut diamonds.", price: 112999, originalPrice: 128999, category: "Bracelets", material: "Diamond", gender: "Women", weight: "7.0g", images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80"], rating: 4.9, reviewCount: 29, stock: 6, featured: true, bestseller: false },
  { name: "Gold Kada Bangle Set", description: "A traditional set of gold-plated kada bangles with hand-engraved patterns.", price: 15999, originalPrice: 18999, category: "Bangles", material: "Gold", gender: "Women", weight: "28g", images: ["https://images.unsplash.com/photo-1588444968477-fae99e4ceb78?w=600&q=80"], rating: 4.5, reviewCount: 21, stock: 12, featured: false, bestseller: true },
  { name: "Silver Oxidized Bangles", description: "A pair of intricately carved oxidized silver bangles with a bohemian finish.", price: 4499, originalPrice: 5299, category: "Bangles", material: "Silver", gender: "Women", weight: "16g", images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80"], rating: 4.0, reviewCount: 8, stock: 28, featured: false, bestseller: false },
  { name: "Gold Om Pendant", description: "A sacred Om pendant crafted in 22K gold, finished with a high-polish shine.", price: 9999, originalPrice: 11499, category: "Pendants", material: "Gold", gender: "Unisex", weight: "3.6g", images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80"], rating: 4.6, reviewCount: 17, stock: 24, featured: false, bestseller: false },
  { name: "Diamond Heart Pendant", description: "A romantic heart-shaped pendant set with pavé diamonds on a fine white gold chain.", price: 32999, originalPrice: 37999, category: "Pendants", material: "Diamond", gender: "Women", weight: "3.1g", images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80"], rating: 4.8, reviewCount: 33, stock: 11, featured: true, bestseller: true },
  { name: "Bridal Gold Necklace Set", description: "An opulent bridal necklace set with matching earrings, handcrafted for your special day.", price: 149999, originalPrice: 169999, category: "Bridal Jewelry", material: "Gold", gender: "Women", weight: "45g", images: ["https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80"], rating: 5.0, reviewCount: 22, stock: 5, featured: true, bestseller: true },
  { name: "Bridal Diamond Choker Set", description: "A regal diamond choker set paired with jhumka earrings, designed for the modern bride.", price: 198999, originalPrice: 219999, category: "Bridal Jewelry", material: "Diamond", gender: "Women", weight: "38g", images: ["https://images.unsplash.com/photo-1587056770832-6a4994b08b01?w=600&q=80"], rating: 4.9, reviewCount: 14, stock: 4, featured: false, bestseller: false },
  { name: "Men's Platinum Cufflinks", description: "Sleek platinum cufflinks with brushed-metal finish, a refined accessory for formalwear.", price: 17999, originalPrice: 19999, category: "Men's Jewelry", material: "Platinum", gender: "Men", weight: "14g", images: ["https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&q=80"], rating: 4.4, reviewCount: 7, stock: 19, featured: false, bestseller: false },
];

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: node scripts/seedProducts.mjs <admin-email> <admin-password>");
  process.exit(1);
}

try {
  console.log("Signing in as admin:", email);
  await signInWithEmailAndPassword(auth, email, password);

  console.log(`Seeding ${products.length} products...`);
  const productsRef = collection(db, "products");
  let count = 0;
  for (const product of products) {
    await addDoc(productsRef, { ...product, createdAt: serverTimestamp() });
    count += 1;
    console.log(`  (${count}/${products.length}) ${product.name}`);
  }

  console.log("\nSeeding complete.");
  process.exit(0);
} catch (error) {
  console.error("Seeding failed:", error.code || error.message);
  process.exit(1);
}
