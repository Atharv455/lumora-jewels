import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const productsRef = collection(db, "products");

export async function getAllProducts() {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function getProductById(productId) {
  const snapshot = await getDoc(doc(db, "products", productId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function addProduct(productData) {
  const docRef = await addDoc(productsRef, {
    ...productData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(productId, productData) {
  await updateDoc(doc(db, "products", productId), productData);
}

export async function deleteProduct(productId) {
  await deleteDoc(doc(db, "products", productId));
}
