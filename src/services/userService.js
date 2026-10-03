import { doc, getDoc, getDocs, collection, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function createUserProfile(uid, { name, email }) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    uid,
    name,
    email,
    role: "customer",
    createdAt: serverTimestamp(),
  });
  // Re-read the document so the caller gets the resolved server timestamp
  // instead of the unresolved serverTimestamp() sentinel.
  const snapshot = await getDoc(userRef);
  return snapshot.data();
}

export async function getUserProfile(uid) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
}

// Admin-only: Firestore rules only allow this collection scan when the
// caller's own role is "admin".
export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((docSnap) => docSnap.data());
}
