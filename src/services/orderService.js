import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ordersRef = collection(db, "orders");

export async function createOrder(orderData) {
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    orderStatus: "Placed",
    paymentMethod: "COD",
    paymentStatus: "Pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrdersByUser(userId) {
  const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function getOrderById(orderId) {
  const snapshot = await getDoc(doc(db, "orders", orderId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function getAllOrders() {
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function updateOrderStatus(orderId, orderStatus) {
  await updateDoc(doc(db, "orders", orderId), { orderStatus });
}
